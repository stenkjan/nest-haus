/**
 * Cart Add Tracking Endpoint
 * 
 * Tracks when users add configurations to cart (NOT on every selection change).
 * This provides clean data for user tracking analytics.
 */

import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

interface CartAddRequest {
    sessionId: string;
    configuration: Record<string, unknown>;
    totalPrice: number;
    isOhneNestMode?: boolean;
    timestamp?: number;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as CartAddRequest;
        const { sessionId, configuration, totalPrice, isOhneNestMode } = body;

        if (!sessionId) {
            return NextResponse.json({
                error: 'Session ID is required'
            }, { status: 400 });
        }

        console.log(`🛒 Cart add tracked for session: ${sessionId} (isOhneNestMode: ${isOhneNestMode})`);

        // Update session to IN_CART status
        await prisma.userSession.upsert({
            where: { sessionId },
            update: {
                status: 'IN_CART',
                configurationData: configuration as Prisma.InputJsonValue,
                totalPrice,
                isOhneNestMode: isOhneNestMode || false,
                lastActivity: new Date(),
                updatedAt: new Date(),
                // Capture IP/userAgent on updates too (in case they weren't captured on create)
                ipAddress: request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown',
                userAgent: request.headers.get('user-agent') || 'unknown',
                referrer: request.headers.get('referer')
            },
            create: {
                sessionId,
                status: 'IN_CART',
                configurationData: configuration as Prisma.InputJsonValue,
                totalPrice,
                isOhneNestMode: isOhneNestMode || false,
                ipAddress: request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown',
                userAgent: request.headers.get('user-agent') || 'unknown',
                referrer: request.headers.get('referer')
            }
        });

        // SelectionEvents are tracked in the configurator when user makes selections
        // Not here during cart add to avoid duplication

        console.log(`✅ Cart add tracked successfully for ${sessionId}`);

        return NextResponse.json({
            success: true,
            sessionId,
            status: 'IN_CART',
            timestamp: Date.now()
        });

    } catch (error) {
        console.error('❌ Cart add tracking error:', error);

        // Return success to not block user experience
        return NextResponse.json({
            success: true,
            error: 'Tracking temporarily unavailable'
        });
    }
}

