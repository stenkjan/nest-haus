import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ testId: string }> }
) {
    try {
        const { testId } = await params;

        if (!testId) {
            return NextResponse.json({ exists: false }, { status: 400 });
        }

        const test = await prisma.usabilityTest.findUnique({
            where: { testId },
            select: { id: true, status: true } // Only select what we need
        });

        return NextResponse.json({
            exists: !!test,
            active: test?.status === 'IN_PROGRESS'
        });

    } catch (error) {
        console.error('Session verification error:', error);
        // Return false on error to be safe
        return NextResponse.json({ exists: false });
    }
}
