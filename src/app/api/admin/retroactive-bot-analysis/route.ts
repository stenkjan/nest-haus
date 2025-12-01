import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BotDetector } from '@/lib/security/BotDetector';

/**
 * POST /api/admin/retroactive-bot-analysis
 * 
 * Analyzes existing sessions that don't have bot detection data
 * and updates them with bot flags
 */
export async function POST() {
  try {
    const botDetector = BotDetector.getInstance();
    
    // Find sessions without bot detection
    const sessions = await prisma.userSession.findMany({
      where: {
        isBot: null, // Not yet analyzed
      },
      select: {
        id: true,
        sessionId: true,
        userAgent: true,
        ipAddress: true,
        interactionEvents: {
          select: {
            id: true,
          },
        },
        startTime: true,
        lastActivity: true,
      },
    });

    console.log(`🔍 Found ${sessions.length} sessions to analyze`);

    let analyzed = 0;
    let botsDetected = 0;
    let realUsers = 0;

    for (const session of sessions) {
      const botResult = await botDetector.detectBot(
        session.sessionId,
        session.userAgent || 'unknown',
        undefined,
        session.ipAddress || undefined
      );

      const interactionCount = session.interactionEvents.length;
      const duration = Math.floor(
        (session.lastActivity.getTime() - session.startTime.getTime()) / 1000
      );

      // Calculate quality score
      let qualityScore = 0.5;
      if (!botResult.isBot) {
        qualityScore = 0.7; // Baseline for humans
        if (interactionCount > 0) qualityScore += 0.1;
        if (duration > 30) qualityScore += 0.1;
        if (interactionCount > 5) qualityScore += 0.1;
      } else {
        qualityScore = Math.max(0, 0.5 - botResult.confidence * 0.5);
      }

      // Update session
      await prisma.userSession.update({
        where: { id: session.id },
        data: {
          isBot: botResult.isBot,
          botConfidence: botResult.confidence,
          botDetectionMethod: botResult.detectionMethods.join(', '),
          qualityScore,
        },
      });

      // Save bot detection record if it's a bot
      if (botResult.isBot) {
        await prisma.botDetection.create({
          data: {
            sessionId: session.sessionId,
            isBot: botResult.isBot,
            confidence: botResult.confidence,
            detectionMethods: botResult.detectionMethods,
            riskLevel: botResult.riskLevel,
            allowAccess: botResult.allowAccess,
            reasons: botResult.reasons,
            userAgent: session.userAgent,
            ipAddress: session.ipAddress,
          },
        }).catch(() => {
          // May already exist, ignore
        });

        botsDetected++;
      } else {
        realUsers++;
      }

      analyzed++;

      if (analyzed % 50 === 0) {
        console.log(`📊 Progress: ${analyzed}/${sessions.length} analyzed`);
      }
    }

    console.log(`\n✅ Analysis complete!`);
    console.log(`   Analyzed: ${analyzed} sessions`);
    console.log(`   Bots: ${botsDetected}`);
    console.log(`   Real Users: ${realUsers}`);

    return NextResponse.json({
      success: true,
      analyzed,
      botsDetected,
      realUsers,
      message: `Successfully analyzed ${analyzed} sessions`,
    });
  } catch (error) {
    console.error('❌ Retroactive analysis failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

