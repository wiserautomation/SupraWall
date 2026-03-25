// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextResponse } from 'next/server';
import { getGAClient, propertyId } from '@/lib/ga-client';

export async function GET() {
    try {
        const client = getGAClient();

        // 1. Fetch Users, Sessions, Pageviews (Last 7 Days)
        const [response] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'date' }],
            metrics: [
                { name: 'activeUsers' },
                { name: 'sessions' },
                { name: 'screenPageViews' },
                { name: 'averageSessionDuration' }
            ],
            orderBys: [{ dimension: { dimensionName: 'date' } }],
        });

        // 2. Fetch Top Pages (Last 7 Days)
        const [pagesResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'pagePath' }],
            metrics: [{ name: 'screenPageViews' }],
            limit: 5,
        });

        // 3. Fetch Top Countries (Last 7 Days)
        const [geosResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'country' }],
            metrics: [{ name: 'activeUsers' }],
            limit: 5,
        });

        const dailyStats = response.rows?.map(row => ({
            date: row.dimensionValues?.[0].value,
            users: Number(row.metricValues?.[0].value),
            sessions: Number(row.metricValues?.[1].value),
            pageviews: Number(row.metricValues?.[2].value),
        }));

        const totals = {
            users: Number(response.totals?.[0]?.metricValues?.[0]?.value || 0),
            sessions: Number(response.totals?.[0]?.metricValues?.[1]?.value || 0),
            pageviews: Number(response.totals?.[0]?.metricValues?.[2]?.value || 0),
            avgSessionDuration: Number(response.totals?.[0]?.metricValues?.[3]?.value || 0),
        };

        const topPages = pagesResponse.rows?.map(row => ({
            path: row.dimensionValues?.[0].value,
            views: Number(row.metricValues?.[0].value),
        }));

        const topGeos = geosResponse.rows?.map(row => ({
            country: row.dimensionValues?.[0].value,
            users: Number(row.metricValues?.[0].value),
        }));

        return NextResponse.json({
            dailyStats,
            totals,
            topPages,
            topGeos
        });

    } catch (error: any) {
        console.error("[GA API Error]", error);
        return NextResponse.json({ 
            error: "Failed to fetch GA data", 
            details: error.message,
            propertyId: propertyId 
        }, { status: 500 });
    }
}
