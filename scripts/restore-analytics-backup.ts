/**
 * Restore Analytics Backup Script
 * 
 * Decompresses and restores analytics data from a backup file.
 * USE WITH CAUTION: This will delete all existing analytics data.
 */

import { prisma } from '../src/lib/prisma';
import redis from '../src/lib/redis';
import fs from 'fs';
import path from 'path';
import { gunzip } from 'zlib';
import { promisify } from 'util';
import readline from 'readline';

const gunzipAsync = promisify(gunzip);

interface BackupData {
  metadata: {
    backupDate: string;
    version: string;
    recordCounts: {
      sessions: number;
      interactions: number;
      selections: number;
      metrics: number;
    };
  };
  sessions: Array<{
    id: string;
    sessionId: string;
    ipAddress: string | null;
    userAgent: string | null;
    referrer: string | null;
    utmSource: string | null;
    utmMedium: string | null;
    utmCampaign: string | null;
    startTime: string;
    endTime: string | null;
    lastActivity: string;
    status: string;
    configurationData: unknown;
    country: string | null;
    city: string | null;
    latitude: number | null;
    longitude: number | null;
    trafficSource: string | null;
    trafficMedium: string | null;
    referralDomain: string | null;
    visitCount: number;
    lastVisitDate: string;
    userIdentifier: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  interactions: Array<{
    id: string;
    sessionId: string;
    eventType: string;
    category: string;
    elementId: string | null;
    selectionValue: string | null;
    timestamp: string;
    additionalData: unknown;
  }>;
  selections: Array<{
    id: string;
    sessionId: string;
    category: string;
    selection: string;
    timestamp: string;
  }>;
  metrics: Array<{
    id: string;
    sessionId: string | null;
    metricType: string;
    value: number;
    timestamp: string;
    metadata: unknown;
  }>;
}

async function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, (answer) => {
    rl.close();
    resolve(answer);
  }));
}

async function restoreBackup(backupFilePath: string) {
  console.log('📦 Analytics Backup Restoration\n');
  console.log('⚠️  WARNING: This will DELETE all existing analytics data!\n');

  // Check if file exists
  if (!fs.existsSync(backupFilePath)) {
    console.error(`❌ Error: Backup file not found: ${backupFilePath}`);
    process.exit(1);
  }

  try {
    // Read and decompress backup file
    console.log('📂 Reading backup file...');
    const compressedData = fs.readFileSync(backupFilePath);
    
    console.log('🗜️  Decompressing backup...');
    const decompressedData = await gunzipAsync(compressedData);
    const backupData: BackupData = JSON.parse(decompressedData.toString('utf-8'));

    // Display backup information
    console.log('\n📊 Backup Information:');
    console.log(`   Date: ${new Date(backupData.metadata.backupDate).toLocaleString()}`);
    console.log(`   Version: ${backupData.metadata.version}`);
    console.log(`\n📈 Records to restore:`);
    console.log(`   ${backupData.metadata.recordCounts.sessions} user sessions`);
    console.log(`   ${backupData.metadata.recordCounts.interactions} interaction events`);
    console.log(`   ${backupData.metadata.recordCounts.selections} selection events`);
    console.log(`   ${backupData.metadata.recordCounts.metrics} performance metrics`);

    // Confirm restoration
    console.log('\n⚠️  This will permanently delete all current analytics data.');
    const answer = await askQuestion('\nType "yes" to proceed with restoration: ');

    if (answer.toLowerCase() !== 'yes') {
      console.log('\n❌ Restoration cancelled.');
      process.exit(0);
    }

    console.log('\n🗑️  Clearing existing data...');

    // Delete existing data (in correct order due to foreign keys)
    const deletedInteractions = await prisma.interactionEvent.deleteMany({});
    console.log(`   ✓ Deleted ${deletedInteractions.count} interaction events`);

    const deletedSelections = await prisma.selectionEvent.deleteMany({});
    console.log(`   ✓ Deleted ${deletedSelections.count} selection events`);

    const deletedMetrics = await prisma.performanceMetric.deleteMany({});
    console.log(`   ✓ Deleted ${deletedMetrics.count} performance metrics`);

    const deletedSessions = await prisma.userSession.deleteMany({});
    console.log(`   ✓ Deleted ${deletedSessions.count} user sessions`);

    // Clear Redis
    console.log('\n🧹 Clearing Redis cache...');
    const sessionKeys = await redis.keys('session:*');
    const analyticsKeys = await redis.keys('analytics:*');
    const contentKeys = await redis.keys('content_session:*');
    
    const allKeys = [...sessionKeys, ...analyticsKeys, ...contentKeys];
    if (allKeys.length > 0) {
      await redis.del(...allKeys);
      console.log(`   ✓ Cleared ${allKeys.length} Redis keys`);
    } else {
      console.log('   ✓ No Redis keys to clear');
    }

    // Restore data
    console.log('\n📥 Restoring data from backup...');

    // Restore sessions
    console.log('   Restoring user sessions...');
    for (const session of backupData.sessions) {
      await prisma.userSession.create({
        data: {
          ...session,
          startTime: new Date(session.startTime),
          endTime: session.endTime ? new Date(session.endTime) : null,
          lastActivity: new Date(session.lastActivity),
          lastVisitDate: new Date(session.lastVisitDate),
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
        }
      });
    }
    console.log(`   ✓ Restored ${backupData.sessions.length} sessions`);

    // Restore interaction events
    console.log('   Restoring interaction events...');
    for (const interaction of backupData.interactions) {
      await prisma.interactionEvent.create({
        data: {
          ...interaction,
          timestamp: new Date(interaction.timestamp),
        }
      });
    }
    console.log(`   ✓ Restored ${backupData.interactions.length} interaction events`);

    // Restore selection events
    console.log('   Restoring selection events...');
    for (const selection of backupData.selections) {
      await prisma.selectionEvent.create({
        data: {
          ...selection,
          timestamp: new Date(selection.timestamp),
        }
      });
    }
    console.log(`   ✓ Restored ${backupData.selections.length} selection events`);

    // Restore performance metrics
    console.log('   Restoring performance metrics...');
    for (const metric of backupData.metrics) {
      await prisma.performanceMetric.create({
        data: {
          ...metric,
          timestamp: new Date(metric.timestamp),
        }
      });
    }
    console.log(`   ✓ Restored ${backupData.metrics.length} performance metrics`);

    console.log('\n✅ Restoration completed successfully!');
    console.log(`\n📊 Final Statistics:`);
    console.log(`   ${backupData.sessions.length} user sessions restored`);
    console.log(`   ${backupData.interactions.length} interaction events restored`);
    console.log(`   ${backupData.selections.length} selection events restored`);
    console.log(`   ${backupData.metrics.length} performance metrics restored`);

  } catch (error) {
    console.error('\n❌ Restoration failed:', error);
    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`);
    }
    process.exit(1);
  }
}

// Get backup file path from command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('❌ Error: Please provide a backup file path');
  console.error('Usage: npm run restore-backup -- ./path/to/backup.json.gz');
  process.exit(1);
}

const backupFilePath = path.resolve(args[0]);

// Execute restoration
restoreBackup(backupFilePath)
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

export {};

