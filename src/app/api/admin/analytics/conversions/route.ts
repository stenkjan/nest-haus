/**
 * Conversions & Payments API
 * 
 * Returns conversion metrics:
 * - Configuration type (mit/ohne)
 * - Konzeptcheck payments
 * - Appointment requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    // Get sessions for last 30 days
    const sessions = await prisma.userSession.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        hasConfigurationMode: true,
        isOhneNestMode: true,
        hasPaidKonzeptcheck: true,
        konzeptcheckAmount: true,
        hasAppointmentRequest: true,
        status: true
      }
    });

    const totalSessions = sessions.length;

    // Configuration type metrics
    const withConfiguration = sessions.filter(s => s.hasConfigurationMode).length;
    const ohneNest = sessions.filter(s => s.isOhneNestMode).length;

    // Konzeptcheck payment metrics
    const konzeptcheckSessions = sessions.filter(s => s.hasPaidKonzeptcheck);
    const konzeptcheckTotal = konzeptcheckSessions.length;
    const konzeptcheckAmount = konzeptcheckSessions.reduce(
      (sum, s) => sum + (s.konzeptcheckAmount || 0),
      0
    );

    // Appointment request metrics
    const appointmentRequests = sessions.filter(s => s.hasAppointmentRequest).length;

    // Overall conversion rate (CONVERTED status)
    const converted = sessions.filter(s => s.status === 'CONVERTED').length;
    const overallConversionRate = totalSessions > 0
      ? Math.round((converted / totalSessions) * 10000) / 100
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        configurationType: {
          withConfiguration,
          withConfigurationPercentage: totalSessions > 0 
            ? Math.round((withConfiguration / totalSessions) * 100)
            : 0,
          ohneNest,
          ohneNestPercentage: totalSessions > 0
            ? Math.round((ohneNest / totalSessions) * 100)
            : 0
        },
        konzeptcheckPayments: {
          total: konzeptcheckTotal,
          totalAmount: konzeptcheckAmount,
          averageAmount: konzeptcheckTotal > 0 
            ? Math.round(konzeptcheckAmount / konzeptcheckTotal)
            : 0,
          conversionRate: totalSessions > 0
            ? Math.round((konzeptcheckTotal / totalSessions) * 10000) / 100
            : 0
        },
        appointmentRequests: {
          total: appointmentRequests,
          conversionRate: totalSessions > 0
            ? Math.round((appointmentRequests / totalSessions) * 10000) / 100
            : 0
        },
        overallConversion: {
          converted,
          conversionRate: overallConversionRate,
          totalSessions
        }
      },
      metadata: {
        period: '30 days',
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Failed to fetch conversions data:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch conversions data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

