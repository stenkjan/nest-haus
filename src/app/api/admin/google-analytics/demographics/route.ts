import { NextResponse } from 'next/server';
import { getAnalyticsClient, getPropertyId } from '@/lib/google-analytics';

export const dynamic = 'force-dynamic';

interface AnalyticsResponse {
    rows?: Array<{
        dimensionValues?: Array<{ value?: string | null }>;
        metricValues?: Array<{ value?: string | null }>;
    }>;
}

export async function GET() {
    try {
        const client = getAnalyticsClient();
        const propertyId = getPropertyId();

        // Re-query for specific dimensions to avoid cross-product fragmentation
        const ageReport = await client.runReport({
            property: propertyId,
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'userAgeBracket' }],
            metrics: [{ name: 'activeUsers' }],
        });
        const ageResponse = ageReport[0] as AnalyticsResponse;

        const genderReport = await client.runReport({
            property: propertyId,
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'userGender' }],
            metrics: [{ name: 'activeUsers' }],
        });
        const genderResponse = genderReport[0] as AnalyticsResponse;

        const interestReport = await client.runReport({
            property: propertyId,
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'interestCategory' }],
            metrics: [{ name: 'activeUsers' }],
            limit: 10,
        });
        const interestResponse = interestReport[0] as AnalyticsResponse;

        interface ProcessedItem {
            label?: string;
            category?: string;
            count: number;
            percentage?: number;
        }

        const processResponse = (res: AnalyticsResponse, labelKey: 'label' | 'category' = 'label') => {
            let total = 0;
            const items: ProcessedItem[] = res.rows?.map((row) => {
                const count = parseInt(row.metricValues?.[0]?.value || '0');
                total += count;
                return {
                    [labelKey]: row.dimensionValues?.[0]?.value || 'Unknown',
                    count,
                } as ProcessedItem;
            }) || [];

            return { items, total };
        };

        const ageData = processResponse(ageResponse);
        const genderData = processResponse(genderResponse);
        const interestData = processResponse(interestResponse, 'category');

        // Calculate percentages based on the specific query totals
        const finalAgeGroups = ageData.items.map((item) => ({
            ...item,
            percentage: ageData.total > 0 ? Math.round((item.count / ageData.total) * 100) : 0,
        }));

        const finalGender = genderData.items.map((item) => ({
            ...item,
            percentage: genderData.total > 0 ? Math.round((item.count / genderData.total) * 100) : 0,
        }));

        const finalInterests = interestData.items.map((item) => ({
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
