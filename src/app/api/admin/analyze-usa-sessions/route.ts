import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface SessionAnalysis {
  sessionId: string;
  ipAddress: string | null;
  userAgent: string | null;
  country: string | null;
  city: string | null;
  startTime: Date;
  lastActivity: Date;
  visitCount: number;
  hasInteractions: boolean;
  interactionCount: number;
  sessionDuration: number;
  isLikelyBot: boolean;
  botConfidence: number;
  botReasons: string[];
  botType: string;
}

const BOT_PATTERNS = {
  googlebot: /googlebot|google-inspectiontool/i,
  bingbot: /bingbot|msnbot/i,
  vercel: /vercel/i,
  scraper: /scrapy|beautifulsoup|wget|curl|python-requests|axios/i,
  headless: /headlesschrome|puppeteer|selenium|phantomjs/i,
};

const GOOGLE_BOT_IPS = ['66.249.', '64.233.', '72.14.', '209.85.', '216.239.'];
const VERCEL_IPS = ['76.76.'];

function classifyBot(userAgent: string | null, ipAddress: string | null): {
  type: string;
  confidence: number;
  reasons: string[];
} {
  const reasons: string[] = [];
  let type = 'unknown';
  let confidence = 0;

  if (!userAgent) {
    reasons.push('No user agent');
    return { type: 'scraper', confidence: 0.8, reasons };
  }

  if (BOT_PATTERNS.googlebot.test(userAgent)) {
    type = 'googlebot';
    confidence = 0.95;
    reasons.push('User-Agent matches Googlebot');
  } else if (BOT_PATTERNS.bingbot.test(userAgent)) {
    type = 'bingbot';
    confidence = 0.95;
    reasons.push('User-Agent matches Bingbot');
  } else if (BOT_PATTERNS.vercel.test(userAgent)) {
    type = 'vercel';
    confidence = 0.9;
    reasons.push('User-Agent matches Vercel');
  } else if (BOT_PATTERNS.scraper.test(userAgent)) {
    type = 'scraper';
    confidence = 0.85;
    reasons.push('User-Agent matches scraper');
  } else if (BOT_PATTERNS.headless.test(userAgent)) {
    type = 'scraper';
    confidence = 0.9;
    reasons.push('Headless browser detected');
  }

  if (ipAddress) {
    if (GOOGLE_BOT_IPS.some(range => ipAddress.startsWith(range))) {
      type = 'googlebot';
      confidence = Math.max(confidence, 0.95);
      reasons.push('Google IP range');
    } else if (VERCEL_IPS.some(range => ipAddress.startsWith(range))) {
      type = 'vercel';
      confidence = Math.max(confidence, 0.9);
      reasons.push('Vercel IP range');
    }
  }

  return { type, confidence, reasons };
}

export async function GET() {
  try {
    const sessions = await prisma.userSession.findMany({
      where: {
        startTime: {
          gte: new Date('2024-11-18'),
        },
      },
      include: {
        interactionEvents: {
          select: {
            id: true,
            eventType: true,
            timestamp: true,
          },
        },
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    const usaSessions = sessions.filter(s => s.country === 'US' || s.country === 'USA');

    const analyzed: SessionAnalysis[] = [];
    let realUsers = 0;
    let bots = 0;
    let unknown = 0;

    const botsByType = {
      googlebot: 0,
      bingbot: 0,
      vercel: 0,
      scraper: 0,
      other: 0,
    };

    let withInteractions = 0;
    let totalDuration = 0;

    for (const session of usaSessions) {
      const interactionCount = session.interactionEvents.length;
      
      const duration = session.endTime 
        ? Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000)
        : Math.floor((session.lastActivity.getTime() - session.startTime.getTime()) / 1000);

      const botClassification = classifyBot(session.userAgent, session.ipAddress);
      
      let isLikelyBot = botClassification.confidence > 0.7;
      let botConfidence = botClassification.confidence;
      const botReasons = [...botClassification.reasons];

      if (interactionCount === 0 && duration < 5) {
        isLikelyBot = true;
        botConfidence = Math.max(botConfidence, 0.6);
        botReasons.push('No interactions, short duration');
      }

      if (session.visitCount > 10 && interactionCount === 0) {
        isLikelyBot = true;
        botConfidence = Math.max(botConfidence, 0.7);
        botReasons.push('Many visits, no interactions');
      }

      let botType = botClassification.type;
      if (!isLikelyBot && interactionCount > 0 && duration > 10) {
        botType = 'real_user';
      }

      analyzed.push({
        sessionId: session.sessionId,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        country: session.country,
        city: session.city,
        startTime: session.startTime,
        lastActivity: session.lastActivity,
        visitCount: session.visitCount,
        hasInteractions: interactionCount > 0,
        interactionCount,
        sessionDuration: duration,
        isLikelyBot,
        botConfidence,
        botReasons,
        botType,
      });

      if (isLikelyBot) {
        bots++;
        if (botType === 'googlebot') botsByType.googlebot++;
        else if (botType === 'bingbot') botsByType.bingbot++;
        else if (botType === 'vercel') botsByType.vercel++;
        else if (botType === 'scraper') botsByType.scraper++;
        else botsByType.other++;
      } else if (botType === 'real_user') {
        realUsers++;
      } else {
        unknown++;
      }

      if (interactionCount > 0) withInteractions++;
      totalDuration += duration;
    }

    return NextResponse.json({
      totalSessions: sessions.length,
      usaSessions: usaSessions.length,
      realUsers,
      bots,
      unknown,
      botsByType,
      interactionStats: {
        withInteractions,
        withoutInteractions: usaSessions.length - withInteractions,
        avgDuration: usaSessions.length > 0 ? totalDuration / usaSessions.length : 0,
      },
      ga4Comparison: {
        ga4ActiveUsers: 78,
        adminTotal: sessions.length,
        adminRealUsers: sessions.length - bots,
        expectedAlignment: `${sessions.length - bots} ≈ 78-85`,
      },
      sampleSessions: analyzed.slice(0, 20),
    });
  } catch (error) {
    console.error('Error analyzing USA sessions:', error);
    return NextResponse.json(
      { error: 'Failed to analyze sessions' },
      { status: 500 }
    );
  }
}

