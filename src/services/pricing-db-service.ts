/**
 * Pricing Database Service
 * 
 * Manages shadow copy of pricing data in database
 * Fetches from database instead of Google Sheets for better performance
 */

import { prisma } from '@/lib/prisma';
import type { PricingData } from './pricing-sheet-service';
import { Prisma } from '@prisma/client';

/**
 * Save pricing data snapshot to database
 */
export async function savePricingSnapshot(
  pricingData: PricingData,
  syncedBy: 'cron' | 'manual' | 'api' = 'cron'
): Promise<void> {
  // Deactivate all existing snapshots
  await prisma.pricingDataSnapshot.updateMany({
    where: { isActive: true },
    data: { isActive: false },
  });

  // Get next version number
  const lastSnapshot = await prisma.pricingDataSnapshot.findFirst({
    orderBy: { version: 'desc' },
    select: { version: true },
  });

  const nextVersion = (lastSnapshot?.version || 0) + 1;

  // Create new active snapshot
  await prisma.pricingDataSnapshot.create({
    data: {
      version: nextVersion,
      pricingData: pricingData as unknown as Prisma.InputJsonValue,
      syncedBy,
      isActive: true,
    },
  });
}

/**
 * Get active pricing data from database
 */
export async function getPricingDataFromDb(): Promise<PricingData | null> {
  const snapshot = await prisma.pricingDataSnapshot.findFirst({
    where: { isActive: true },
    orderBy: { syncedAt: 'desc' },
  });

  if (!snapshot) {
    return null;
  }

  return snapshot.pricingData as unknown as PricingData;
}

/**
 * Get latest pricing data version info
 */
export async function getPricingDataInfo(): Promise<{
  version: number;
  syncedAt: Date;
  syncedBy: string;
} | null> {
  const snapshot = await prisma.pricingDataSnapshot.findFirst({
    where: { isActive: true },
    orderBy: { syncedAt: 'desc' },
    select: {
      version: true,
      syncedAt: true,
      syncedBy: true,
    },
  });

  return snapshot;
}

