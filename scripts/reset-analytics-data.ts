/**
 * Reset Analytics Data Script
 * 
 * Clears all analytics data from the database and Redis
 * USE WITH CAUTION: This will permanently delete all session tracking data
 */

import { prisma } from '../src/lib/prisma';
import redis from '../src/lib/redis';

async function resetAnalyticsData() {
  console.log('🗑️  Resetting all analytics data...');
  
  try {
    // Delete all interaction events first (due to foreign key constraints)
    console.log('Deleting interaction events...');
    const deletedInteractions = await prisma.interactionEvent.deleteMany({});
    console.log(`✓ Deleted ${deletedInteractions.count} interaction events`);
    
    // Delete all selection events
    console.log('Deleting selection events...');
    const deletedSelections = await prisma.selectionEvent.deleteMany({});
    console.log(`✓ Deleted ${deletedSelections.count} selection events`);
    
    // Delete all performance metrics
    console.log('Deleting performance metrics...');
    const deletedMetrics = await prisma.performanceMetric.deleteMany({});
    console.log(`✓ Deleted ${deletedMetrics.count} performance metrics`);
    
    // Delete all sessions
    console.log('Deleting user sessions...');
    const deletedSessions = await prisma.userSession.deleteMany({});
    console.log(`✓ Deleted ${deletedSessions.count} user sessions`);
    
    // Clear Redis session data
    console.log('Clearing Redis session data...');
    const sessionKeys = await redis.keys('session:*');
    if (sessionKeys.length > 0) {
      await redis.del(...sessionKeys);
      console.log(`✓ Cleared ${sessionKeys.length} Redis session keys`);
    } else {
      console.log('✓ No Redis session keys to clear');
    }
    
    // Clear Redis analytics data
    console.log('Clearing Redis analytics data...');
    const analyticsKeys = await redis.keys('analytics:*');
    if (analyticsKeys.length > 0) {
      await redis.del(...analyticsKeys);
      console.log(`✓ Cleared ${analyticsKeys.length} Redis analytics keys`);
    } else {
      console.log('✓ No Redis analytics keys to clear');
    }
    
    // Clear Redis content session data
    console.log('Clearing Redis content session data...');
    const contentKeys = await redis.keys('content_session:*');
    if (contentKeys.length > 0) {
      await redis.del(...contentKeys);
      console.log(`✓ Cleared ${contentKeys.length} Redis content session keys`);
    } else {
      console.log('✓ No Redis content session keys to clear');
    }
    
    console.log('\n✅ All analytics data reset successfully!');
    console.log('You can now start fresh with new user tracking data.');
    
  } catch (error) {
    console.error('❌ Error resetting analytics data:', error);
    throw error;
  }
}

// Execute the reset
resetAnalyticsData()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

export {};

