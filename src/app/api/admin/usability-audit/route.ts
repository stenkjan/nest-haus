/**
 * Usability Audit API
 * 
 * Analyzes user behavior data from social media campaigns
 * Generates data-driven recommendations for conversion optimization
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Analyze last 30 days of data
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get all sessions
    const sessions = await prisma.userSession.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        utmSource: true,
        configurationData: true,
      },
    });

    // Get conversions
    const conversions = await prisma.customerInquiry.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    // Get interaction events for behavior analysis
    const interactions = await prisma.interactionEvent.findMany({
      where: {
        timestamp: { gte: thirtyDaysAgo },
      },
      select: {
        eventType: true,
        category: true,
        metadata: true,
      },
    });

    // Calculate metrics
    const totalSessions = sessions.length;
    const totalConversions = conversions.length;
    const conversionRate = totalSessions > 0 ? (totalConversions / totalSessions) * 100 : 0;

    // Calculate bounce rate (sessions < 30 seconds)
    const bounces = sessions.filter(s => {
      const duration = (s.updatedAt.getTime() - s.createdAt.getTime()) / 1000;
      return duration < 30;
    }).length;
    const bounceRate = totalSessions > 0 ? (bounces / totalSessions) * 100 : 0;

    // Calculate avg session duration
    const totalDuration = sessions.reduce((sum, s) => {
      return sum + (s.updatedAt.getTime() - s.createdAt.getTime()) / 1000;
    }, 0);
    const avgSessionDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;

    // Calculate form abandonment rate
    const formStarts = interactions.filter(i => i.eventType === 'form_start').length;
    const formAbandons = interactions.filter(i => i.eventType === 'form_abandon').length;
    const formAbandonmentRate = formStarts > 0 ? (formAbandons / formStarts) * 100 : 0;

    // Generate issues based on data analysis
    const issues: Array<{
      severity: 'critical' | 'high' | 'medium' | 'low';
      category: string;
      issue: string;
      impact: string;
      recommendation: string;
      dataPoint?: string;
    }> = [];

    // Critical: High bounce rate
    if (bounceRate > 60) {
      issues.push({
        severity: 'critical',
        category: 'User Engagement',
        issue: 'Very high bounce rate detected',
        impact: `${Math.round(bounceRate)}% of users leave within 30 seconds, indicating poor landing page engagement or irrelevant traffic.`,
        recommendation: 'Review social media ad targeting. Ensure ad messaging matches landing page content. Add engaging hero content above fold. Test different headline variations.',
        dataPoint: `Bounce Rate: ${Math.round(bounceRate)}%`,
      });
    }

    // Critical: Low conversion rate
    if (conversionRate < 1) {
      issues.push({
        severity: 'critical',
        category: 'Conversion',
        issue: 'Critically low conversion rate',
        impact: `Only ${conversionRate.toFixed(1)}% of visitors convert. Industry average is 2-3%. Significant revenue loss.`,
        recommendation: 'Immediate action needed: Simplify contact/checkout forms. Add trust signals (reviews, certifications). Test prominent CTAs. Consider exit-intent popups.',
        dataPoint: `Conversion Rate: ${conversionRate.toFixed(1)}%`,
      });
    }

    // High: Short session duration
    if (avgSessionDuration < 120) {
      issues.push({
        severity: 'high',
        category: 'User Engagement',
        issue: 'Short average session duration',
        impact: `Users spend only ${Math.round(avgSessionDuration)}s on site. Not enough time to understand value proposition or explore configurations.`,
        recommendation: 'Add engaging video content. Improve navigation clarity. Create interactive elements. Optimize mobile experience for social media traffic.',
        dataPoint: `Avg. Session: ${Math.round(avgSessionDuration)}s`,
      });
    }

    // High: Form abandonment
    if (formAbandonmentRate > 50) {
      issues.push({
        severity: 'high',
        category: 'Forms',
        issue: 'High form abandonment rate',
        impact: `${Math.round(formAbandonmentRate)}% of users start forms but don't complete them. Losing potential leads.`,
        recommendation: 'Reduce required fields. Add progress indicators. Implement auto-save. Test single-column vs two-column layout. Add inline validation.',
        dataPoint: `Form Abandonment: ${Math.round(formAbandonmentRate)}%`,
      });
    }

    // Medium: Mobile optimization
    const mobileTraffic = sessions.filter(s => {
      return s.utmSource?.toLowerCase().includes('facebook') || 
             s.utmSource?.toLowerCase().includes('instagram');
    }).length;
    const mobilePercentage = totalSessions > 0 ? (mobileTraffic / totalSessions) * 100 : 0;

    if (mobilePercentage > 70) {
      issues.push({
        severity: 'medium',
        category: 'Mobile Experience',
        issue: 'High social media traffic (primarily mobile)',
        impact: `${Math.round(mobilePercentage)}% of traffic from social media (mobile-first platforms). Mobile UX is critical for conversions.`,
        recommendation: 'Prioritize mobile optimization: Larger touch targets, simplified navigation, mobile-optimized images. Test on actual devices. Consider mobile-specific landing pages.',
        dataPoint: `Mobile-First Traffic: ${Math.round(mobilePercentage)}%`,
      });
    }

    // Medium: Configurator abandonment (if data available)
    const configuratorSessions = sessions.filter(s => s.configurationData).length;
    const configuratorRate = totalSessions > 0 ? (configuratorSessions / totalSessions) * 100 : 0;

    if (configuratorRate < 30) {
      issues.push({
        severity: 'medium',
        category: 'Configurator',
        issue: 'Low configurator engagement',
        impact: `Only ${Math.round(configuratorRate)}% of visitors use the configurator. Many leave before exploring options.`,
        recommendation: 'Add sample configurations on landing page. Create "Quick Start" guided flow. Show pricing examples upfront. Reduce steps to first preview.',
        dataPoint: `Configurator Usage: ${Math.round(configuratorRate)}%`,
      });
    }

    // Low: A/B testing opportunity
    if (totalSessions > 100) {
      issues.push({
        severity: 'low',
        category: 'Optimization',
        issue: 'Sufficient traffic for A/B testing',
        impact: 'You have enough traffic to run statistically significant A/B tests.',
        recommendation: 'Test: Different CTA button texts, pricing display formats (with/without €/m²), form layouts, hero images. Use A/B testing dashboard to track results.',
        dataPoint: `Sessions: ${totalSessions} (100+ needed for tests)`,
      });
    }

    // Calculate summary
    const summary = {
      criticalIssues: issues.filter(i => i.severity === 'critical').length,
      highIssues: issues.filter(i => i.severity === 'high').length,
      mediumIssues: issues.filter(i => i.severity === 'medium').length,
      lowIssues: issues.filter(i => i.severity === 'low').length,
    };

    return NextResponse.json({
      success: true,
      data: {
        issues: issues.sort((a, b) => {
          const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return severityOrder[a.severity] - severityOrder[b.severity];
        }),
        summary,
        metrics: {
          bounceRate: Math.round(bounceRate * 10) / 10,
          avgSessionDuration: Math.round(avgSessionDuration),
          conversionRate: Math.round(conversionRate * 10) / 10,
          formAbandonmentRate: Math.round(formAbandonmentRate * 10) / 10,
        },
        generatedAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Usability audit API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate usability audit',
      },
      { status: 500 }
    );
  }
}
