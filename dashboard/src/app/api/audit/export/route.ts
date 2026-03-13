import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();

/**
 * GET /api/audit/export
 * 
 * Exports forensic audit logs for an agent or organization.
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const orgId = searchParams.get('orgId'); // In a real app, get this from JWT/Session

        if (!orgId) {
            return NextResponse.json({ error: 'Unauthorized. Organization link required.' }, { status: 401 });
        }

        // Query logs for the org
        const logsSnapshot = await db.collection('auditLogs')
            .where('orgId', '==', orgId)
            .orderBy('createdAt', 'desc')
            .limit(5000) // limit for safety
            .get();

        const logs = logsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                timestamp: data.createdAt?.toDate().toISOString(),
                agentId: data.agentId,
                agentName: data.agentName,
                toolName: data.toolName,
                decision: data.decision,
                reason: data.reason,
                forensicHash: data.forensicHash,
                prevHash: data.prevHash,
                cost: data.estimatedCostUsd || 0,
                args: JSON.stringify(data.args)
            };
        });

        // Convert to CSV
        const headers = ["TIMESTAMP", "AGENT_ID", "AGENT_NAME", "TOOL", "DECISION", "REASON", "COST_USD", "FORENSIC_HASH", "ARGS"];
        const csvRows = [headers.join(",")];

        for (const log of logs) {
            const row = [
                log.timestamp,
                log.agentId,
                `"${log.agentName?.replace(/"/g, '""')}"`,
                log.toolName,
                log.decision,
                `"${log.reason?.replace(/"/g, '""')}"`,
                log.cost,
                log.forensicHash,
                `"${log.args?.replace(/"/g, '""')}"`
            ];
            csvRows.push(row.join(","));
        }

        const csvString = csvRows.join("\n");

        return new NextResponse(csvString, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="suprawall_audit_${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });

    } catch (error: any) {
        console.error('[SupraWall] Export failed:', error);
        return NextResponse.json({ error: 'Export failed' }, { status: 500 });
    }
}
