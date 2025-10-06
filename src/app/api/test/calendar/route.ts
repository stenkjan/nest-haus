import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService } from '@/lib/GoogleCalendarService';

export async function POST(request: NextRequest) {
    try {
        console.log('🧪 Testing Google Calendar integration...');

        // Test 1: Get available time slots for tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD format

        console.log('📅 Testing availability for:', tomorrowStr);
        const timeSlots = await GoogleCalendarService.getAvailableTimeSlots({
            date: tomorrowStr,
            timeZone: 'Europe/Vienna'
        });

        // Test 2: Create a test appointment (optional - uncomment to test)
        /*
        const testEvent = {
          summary: 'Test NEST-Haus Appointment',
          description: 'This is a test appointment created by the API',
          start: {
            dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
            timeZone: 'Europe/Vienna'
          },
          end: {
            dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // Tomorrow + 1 hour
            timeZone: 'Europe/Vienna'
          },
          attendees: [
            {
              email: 'markus@sustain-nest.com',
              displayName: 'Test Customer'
            }
          ]
        };
    
        const eventId = await GoogleCalendarService.createAppointment(testEvent);
        */

        return NextResponse.json({
            success: true,
            message: 'Google Calendar integration test completed',
            results: {
                availabilityTest: {
                    date: tomorrowStr,
                    timeSlots: timeSlots,
                    availableSlots: timeSlots.filter(slot => slot.available).length,
                    totalSlots: timeSlots.length
                },
                // appointmentTest: {
                //   eventId: eventId,
                //   created: !!eventId
                // }
            }
        });

    } catch (error) {
        console.error('❌ Google Calendar test failed:', error);

        return NextResponse.json({
            success: false,
            error: 'Google Calendar test failed',
            details: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}
