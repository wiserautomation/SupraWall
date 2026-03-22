import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/firebase-admin';
import { subMonths, startOfMonth, endOfMonth, isWithinInterval, subDays } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const [activeSubs, allInvoices, usersSnap] = await Promise.all([
            stripe.subscriptions.list({ status: 'active', limit: 100, expand: ['data.customer'] }),
            stripe.invoices.list({ limit: 100, expand: ['data.customer'] }),
            db.collection('users').get()
        ]);

        const totalUsers = usersSnap.size || 1;
        const activePaidCount = activeSubs.data.length;

        // --- 1. Compute MRR ---
        let mrr = 0;
        activeSubs.data.forEach(sub => {
            const amount = sub.items.data[0]?.plan?.amount || 0;
            mrr += (amount / 100);
        });

        const arr = mrr * 12;
        const arpu = activePaidCount > 0 ? mrr / activePaidCount : 0;

        // --- 2. Monthly Revenue (Last 12 Months) ---
        const monthlyRevenue = [];
        for (let i = 11; i >= 0; i--) {
            const monthDate = subMonths(new Date(), i);
            const start = startOfMonth(monthDate);
            const end = endOfMonth(monthDate);
            const monthLabel = monthDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

            const monthInvoices = allInvoices.data.filter(inv => {
                if (!inv.status_transitions?.paid_at) return false;
                const paidDate = new Date(inv.status_transitions.paid_at * 1000);
                return isWithinInterval(paidDate, { start, end });
            });

            const amount = monthInvoices.reduce((acc, inv) => acc + (inv.amount_paid / 100), 0);
            monthlyRevenue.push({ month: monthLabel, revenue: Math.round(amount) });
        }

        // --- 3. Churn & LTV ---
        const last30Days = Math.floor(subDays(new Date(), 30).getTime() / 1000);
        const canceledSubs = await stripe.subscriptions.list({ 
            status: 'canceled', 
            limit: 100,
            created: { gte: last30Days } 
        });
        const churnRate = activePaidCount > 0 ? (canceledSubs.data.length / activePaidCount) : 0;
        const ltv = churnRate > 0 ? arpu / churnRate : arpu * 24; // If zero churn, assume long lifespan

        // --- 4. Payment History (Recent Invoices) ---
        const paymentHistory = allInvoices.data.slice(0, 50).map(inv => ({
            id: inv.id,
            customerEmail: (inv.customer as any)?.email || inv.customer_email || 'Unknown',
            amount: inv.amount_paid / 100,
            status: inv.status,
            date: new Date(inv.created * 1000).toISOString(),
            pdf: inv.invoice_pdf
        }));

        // --- 5. Failed Payments ---
        const failedInvoices = allInvoices.data.filter(inv => inv.status === 'open' || inv.status === 'uncollectible' || (inv as any).status === 'past_due');
        const failedCount = failedInvoices.length;
        const failedAmount = failedInvoices.reduce((acc, inv) => acc + (inv.amount_due / 100), 0);

        // --- 6. MRR Waterfall (Simplified Month-over-Month) ---
        // New MRR: subs started this month
        // Churn MRR: subs canceled this month
        const thisMonthStart = startOfMonth(new Date()).getTime() / 1000;
        const newSubsThisMonth = activeSubs.data.filter(s => s.start_date >= thisMonthStart);
        const newMrrThisMonth = newSubsThisMonth.reduce((acc, s) => acc + ((s.items.data[0]?.plan?.amount || 0) / 100), 0);
        const churnedMrrThisMonth = canceledSubs.data.reduce((acc, s) => acc + ((s.items.data[0]?.plan?.amount || 0) / 100), 0);

        return NextResponse.json({
            summary: {
                mrr,
                arr,
                arpu,
                ltv,
                churnRate: (churnRate * 100).toFixed(1) + "%",
                failedCount,
                failedAmount
            },
            charts: {
                revenueTimeline: monthlyRevenue,
                waterfall: {
                    new: Math.round(newMrrThisMonth),
                    churn: Math.round(churnedMrrThisMonth * -1),
                    expansion: 0, // Not easily computed without subscription versioning
                    contraction: 0
                }
            },
            paymentHistory
        });

    } catch (error: any) {
        console.error('[Admin Revenue API] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch revenue analytics' }, { status: 500 });
    }
}
