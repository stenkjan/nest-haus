import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, phone, sessionId, configurationData } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Create inquiry with configuration data
    const inquiry = await prisma.customerInquiry.create({
      data: {
        email,
        name: name || null,
        phone: phone || null,
        sessionId: sessionId || null,
        configurationData: configurationData as Prisma.InputJsonValue,
        status: 'NEW',
        requestType: 'payment',
        preferredContact: 'EMAIL',
        paymentStatus: 'PENDING',
      },
    });

    console.log('✅ Created inquiry with cart configuration:', inquiry.id);

    return NextResponse.json({
      success: true,
      inquiryId: inquiry.id,
    });
  } catch (error) {
    console.error('❌ Failed to create inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to create inquiry' },
      { status: 500 }
    );
  }
}

