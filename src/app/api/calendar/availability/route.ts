import { NextRequest, NextResponse } from 'next/server';
import { iCloudCalendarService } from '@/lib/iCloudCalendarService';
import { z } from 'zod';

// Validation schema for availability request
const availabilitySchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    timeZone: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        console.log('📅 Getting calendar availability...');

        const body = await request.json();

        // Validate request data
        const validationResult = availabilitySchema.safeParse(body);

        if (!validationResult.success) {
            console.error('❌ Validation failed:', validationResult.error.issues);
            return NextResponse.json(
                {
                    error: 'Ungültige Daten',
                    details: validationResult.error.issues
                },
                { status: 400 }
            );
        }

        const { date, timeZone } = validationResult.data;

        // Check if date is in the future
        const requestDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (requestDate < today) {
            return NextResponse.json(
                { error: 'Datum muss in der Zukunft liegen' },
                { status: 400 }
            );
        }

        // Get available time slots
        const timeSlots = await iCloudCalendarService.getAvailableTimeSlots({
            date,
            timeZone,
        });

        return NextResponse.json({
            success: true,
            date,
            timeZone: timeZone || 'Europe/Vienna',
            timeSlots,
            availableCount: timeSlots.filter(slot => slot.available).length,
        });

    } catch (error) {
        console.error('❌ Error getting calendar availability:', error);

        return NextResponse.json(
            {
                error: 'Fehler beim Laden der Verfügbarkeit',
                message: 'Die Terminverfügbarkeit konnte nicht geladen werden.',
            },
            { status: 500 }
        );
    }
}

// GET method for getting availability for a specific date via query params
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');
        const timeZone = searchParams.get('timeZone');

        if (!date) {
            return NextResponse.json(
                { error: 'Datum ist erforderlich' },
                { status: 400 }
            );
        }

        // Validate date format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return NextResponse.json(
                { error: 'Datum muss im Format YYYY-MM-DD angegeben werden' },
                { status: 400 }
            );
        }

        // Check if date is in the future
        const requestDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (requestDate < today) {
            return NextResponse.json(
                { error: 'Datum muss in der Zukunft liegen' },
                { status: 400 }
            );
        }

        // Get available time slots
        const timeSlots = await iCloudCalendarService.getAvailableTimeSlots({
            date,
            timeZone: timeZone || undefined,
        });

        return NextResponse.json({
            success: true,
            date,
            timeZone: timeZone || 'Europe/Vienna',
            timeSlots,
            availableCount: timeSlots.filter(slot => slot.available).length,
        });

    } catch (error) {
        console.error('❌ Error getting calendar availability:', error);

        return NextResponse.json(
            {
                error: 'Fehler beim Laden der Verfügbarkeit',
                message: 'Die Terminverfügbarkeit konnte nicht geladen werden.',
            },
            { status: 500 }
        );
    }
}
