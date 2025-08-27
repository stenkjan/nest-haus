import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { testId, eventType, data, timestamp } = body;

        console.log("🔍 API: Received tracking request:", {
            testId,
            eventType,
            hasData: !!data,
            timestamp,
            dataKeys: data ? Object.keys(data) : []
        });

        if (!testId || !eventType || !data) {
            console.warn("🔍 API: Missing required fields:", { testId, eventType, hasData: !!data });
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Ensure the test exists
        const test = await prisma.usabilityTest.findUnique({
            where: { testId }
        });

        if (!test) {
            console.warn(`⚠️ Session tracking: Test not found: ${testId}`);
            return NextResponse.json(
                { success: false, error: 'Test not found' },
                { status: 404 }
            );
        }

        console.log("🔍 API: Test found, creating interaction:", {
            testId,
            eventType,
            stepId: getPath(data),
            elementId: getElementId(eventType, data),
            elementText: getValue(eventType, data)
        });

        // Create session tracking interaction
        const interaction = await prisma.testInteraction.create({
            data: {
                testId,
                stepId: getPath(data), // Use path as stepId
                eventType: eventType,
                elementId: getElementId(eventType, data),
                elementText: getValue(eventType, data),
                additionalData: {
                    eventType,
                    data,
                    timestamp,
                    path: getPath(data),
                    userAgent: request.headers.get('user-agent') || 'unknown'
                }
            }
        });

        console.log("🔍 API: Interaction created successfully:", {
            id: interaction.id,
            testId,
            eventType,
            stepId: interaction.stepId,
            elementId: interaction.elementId
        });

        // Update test last activity
        await prisma.usabilityTest.update({
            where: { testId },
            data: {
                updatedAt: new Date()
            }
        });

        console.log(`✅ Session tracking: ${eventType} recorded for test ${testId}`);

        return NextResponse.json({
            success: true,
            timestamp: Date.now(),
            interactionId: interaction.id
        });

    } catch (error) {
        console.error('Session tracking error:', error);

        // Return success to not block user experience
        return NextResponse.json({
            success: true,
            error: 'Tracking temporarily unavailable'
        });
    }
}

// Helper functions to extract standardized data
function getElementId(eventType: string, data: Record<string, unknown>): string | null {
    switch (eventType) {
        case 'button_click':
            return String(data.buttonId || data.buttonText || 'unknown');
        case 'form_interaction':
            return String(data.fieldName || 'unknown');
        case 'configurator_selection':
            return String(data.category || 'unknown');
        case 'page_visit':
            return String(data.path || 'unknown');
        default:
            return null;
    }
}



function getValue(eventType: string, data: Record<string, unknown>): string | null {
    switch (eventType) {
        case 'button_click':
            return String(data.buttonText || '');
        case 'form_interaction':
            return String(data.action || '');
        case 'configurator_selection':
            return String(data.value || '');
        case 'page_visit':
            return String(data.title || '');
        default:
            return null;
    }
}

function getPath(data: Record<string, unknown>): string {
    return String(data.path || '/');
}
