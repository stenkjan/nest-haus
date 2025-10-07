import { NextRequest, NextResponse } from 'next/server';
import { iCloudCalendarService } from '@/lib/iCloudCalendarService';

/**
 * Test API route for debugging time slot generation
 * Usage: GET /api/test/time-slots?date=2025-01-15
 * 
 * This route helps debug time slot issues - remove in production
 */
export async function GET(request: NextRequest) {
    try {
        // Only allow in development or staging
        if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_TIME_SLOT_TESTING) {
            return NextResponse.json(
                { error: 'Time slot testing not allowed in production' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');

        if (!date) {
            return NextResponse.json(
                { error: 'Date parameter is required (format: YYYY-MM-DD)' },
                { status: 400 }
            );
        }

        // Validate date format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return NextResponse.json(
                { error: 'Date must be in YYYY-MM-DD format' },
                { status: 400 }
            );
        }

        console.log('🧪 Testing time slot generation for:', date);

        // Get time slots from the service
        const timeSlots = await iCloudCalendarService.getAvailableTimeSlots({
            date,
            timeZone: 'Europe/Vienna',
        });

        // Format slots for easy reading
        const formattedSlots = timeSlots.map(slot => {
            const start = new Date(slot.start);
            const end = new Date(slot.end);
            return {
                slot: `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}-${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`,
                available: slot.available,
                startISO: slot.start,
                endISO: slot.end,
                startHour: start.getHours(),
                endHour: end.getHours(),
            };
        });

        // Check for any problematic slots
        const problemSlots = formattedSlots.filter(slot =>
            slot.startHour >= 19 || slot.endHour > 19
        );

        return NextResponse.json({
            success: true,
            date,
            totalSlots: timeSlots.length,
            availableSlots: timeSlots.filter(s => s.available).length,
            slots: formattedSlots,
            problemSlots: problemSlots.length > 0 ? problemSlots : null,
            businessHoursConfig: {
                morningStart: 8,
                morningEnd: 12,
                afternoonStart: 13,
                afternoonEnd: 19,
                lastSlotShouldStartAt: '18:00',
                lastSlotShouldEndAt: '19:00',
            },
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        console.error('❌ Time slot test failed:', error);
        return NextResponse.json(
            {
                error: 'Failed to test time slots',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
