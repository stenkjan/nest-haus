/**
 * A/B Testing Results API
 * 
 * Aggregates experiment data from GA4 custom events
 * Shows variant performance and statistical significance
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') || '7d';

    // Calculate date range
    const now = new Date();
    const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Get experiment assignment events (ab_test_assigned)
    const assignments = await prisma.interactionEvent.findMany({
      where: {
        eventType: 'ab_test_assigned',
        timestamp: { gte: startDate },
      },
      select: {
        eventType: true,
        additionalData: true,
      },
    });

    // Get experiment goal events (ab_test_goal)
    const goals = await prisma.interactionEvent.findMany({
      where: {
        eventType: 'ab_test_goal',
        timestamp: { gte: startDate },
      },
      select: {
        eventType: true,
        additionalData: true,
      },
    });

    // Aggregate by experiment
    const experiments = new Map<string, {
      experimentId: string;
      experimentName: string;
      variants: Map<string, {
        variantId: string;
        variantName: string;
        assignments: number;
        goals: number;
      }>;
    }>();

    // Process assignments
    assignments.forEach(event => {
      const metadata = event.additionalData as Record<string, unknown>;
      const experimentId = (metadata.experiment_id || 'unknown') as string;
      const experimentName = (metadata.experiment_name || 'Unknown Experiment') as string;
      const variantId = (metadata.variant_id || 'control') as string;
      const variantName = (metadata.variant_name || 'Control') as string;

      if (!experiments.has(experimentId)) {
        experiments.set(experimentId, {
          experimentId,
          experimentName,
          variants: new Map(),
        });
      }

      const experiment = experiments.get(experimentId)!;
      if (!experiment.variants.has(variantId)) {
        experiment.variants.set(variantId, {
          variantId,
          variantName,
          assignments: 0,
          goals: 0,
        });
      }

      experiment.variants.get(variantId)!.assignments++;
    });

    // Process goals
    goals.forEach(event => {
      const metadata = event.additionalData as Record<string, unknown>;
      const experimentId = (metadata.experiment_id || 'unknown') as string;
      const variantId = (metadata.variant_id || 'control') as string;

      const experiment = experiments.get(experimentId);
      if (experiment) {
        const variant = experiment.variants.get(variantId);
        if (variant) {
          variant.goals++;
        }
      }
    });

    // Format results
    const results = Array.from(experiments.values()).map(experiment => {
      const variantResults = Array.from(experiment.variants.values()).map(variant => ({
        variantId: variant.variantId,
        variantName: variant.variantName,
        assignments: variant.assignments,
        goals: variant.goals,
        conversionRate: variant.assignments > 0 
          ? Math.round((variant.goals / variant.assignments) * 100 * 10) / 10 
          : 0,
      }));

      const totalAssignments = variantResults.reduce((sum, v) => sum + v.assignments, 0);
      const totalGoals = variantResults.reduce((sum, v) => sum + v.goals, 0);
      const overallRate = totalAssignments > 0 
        ? Math.round((totalGoals / totalAssignments) * 100 * 10) / 10 
        : 0;

      return {
        experimentId: experiment.experimentId,
        experimentName: experiment.experimentName,
        variants: variantResults,
        totalAssignments,
        totalGoals,
        overallRate,
      };
    });

    return NextResponse.json({
      success: true,
      data: results,
    });

  } catch (error) {
    console.error('Experiment results API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch experiment results',
      },
      { status: 500 }
    );
  }
}
