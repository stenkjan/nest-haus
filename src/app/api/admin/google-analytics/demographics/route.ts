import { NextResponse } from 'next/server';
import { getAnalyticsClient, getPropertyId } from '@/lib/google-analytics';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const client = getAnalyticsClient();
        const propertyId = getPropertyId();

        const [response] = await client.runReport({
            property: propertyId,
            dateRanges: [
                {
                    startDate: '30daysAgo',
                    endDate: 'today',
                },
            ],
            dimensions: [
                { name: 'userAgeBracket' },
                { name: 'userGender' },
                { name: 'interestCategory' },
            ],
            metrics: [
                { name: 'activeUsers' },
            ],
        });

        // Process data for frontend
        const ageGroups: Record<string, number> = {};
        const gender: Record<string, number> = {};
        const interests: Record<string, number> = {};
        let totalUsers = 0;

        response.rows?.forEach((row) => {
            const users = parseInt(row.metricValues?.[0]?.value || '0');
            totalUsers += users;

            const age = row.dimensionValues?.[0]?.value || 'Unknown';
            const gen = row.dimensionValues?.[1]?.value || 'Unknown';
            const interest = row.dimensionValues?.[2]?.value || 'Unknown';

            if (age !== 'Unknown') ageGroups[age] = (ageGroups[age] || 0) + users;
            if (gen !== 'Unknown') gender[gen] = (gender[gen] || 0) + users;
            if (interest !== 'Unknown') interests[interest] = (interests[interest] || 0) + users;
        });

        // Helper to format for chart
        const formatData = (data: Record<string, number>) => {
            return Object.entries(data)
                .map(([label, count]) => ({
                    label,
                    count,
                    percentage: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0,
                }))
                .sort((a, b) => b.count - a.count);
        };

        // Format interests separately as they might overlap per user (GA4 provides them per user)
        // Note: This is a simplified aggregation. In reality, users have multiple interests.
        // For a more accurate interest list, we should query dimensions separately or handle overlaps.
        // However, for this dashboard overview, this approximation is often sufficient or we can do separate queries.
        // Let's do separate queries for better accuracy if needed, but for now we'll stick to the single query to save quota.
        // Actually, querying them together results in cross-products. Let's do separate queries for cleaner data.

        // Re-query for specific dimensions to avoid cross-product fragmentation
        const [ageResponse] = await client.runReport({
            property: propertyId,
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'userAgeBracket' }],
            metrics: [{ name: 'activeUsers' }],
        });

        const [genderResponse] = await client.runReport({
            property: propertyId,
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'userGender' }],
            metrics: [{ name: 'activeUsers' }],
        });

        const [interestResponse] = await client.runReport({
            property: propertyId,
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'interestCategory' }],
            metrics: [{ name: 'activeUsers' }],
            limit: 10,
        });

        const processResponse = (res: any, labelKey: string = 'label') => {
            let total = 0;
            const items = res.rows?.map((row: any) => {
                const count = parseInt(row.metricValues?.[0]?.value || '0');
                total += count;
                return {
                    [labelKey]: row.dimensionValues?.[0]?.value || 'Unknown',
                    count,
                };
            }) || [];

            return { items, total };
        };

        const ageData = processResponse(ageResponse);
        const genderData = processResponse(genderResponse);
        const interestData = processResponse(interestResponse, 'category');

        // Calculate percentages based on the specific query totals
        const finalAgeGroups = ageData.items.map((item: any) => ({
            ...item,
            percentage: ageData.total > 0 ? Math.round((item.count / ageData.total) * 100) : 0,
        }));

        const finalGender = genderData.items.map((item: any) => ({
            ...item,
            percentage: genderData.total > 0 ? Math.round((item.count / genderData.total) * 100) : 0,
        }));

        const finalInterests = interestData.items.map((item: any) => ({
            ...item,
            percentage: interestData.total > 0 ? Math.round((item.count / interestData.total) * 100) : 0,
        }));

        return NextResponse.json({
            demographics: {
                ageGroups: finalAgeGroups,
                gender: finalGender,
                interests: finalInterests,
                totalUsers: ageData.total, // Use age total as a proxy for total users in this context
            },
        });

    } catch (error) {
        console.error('Error fetching demographics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch demographics data' },
            { status: 500 }
        );
    }
}
