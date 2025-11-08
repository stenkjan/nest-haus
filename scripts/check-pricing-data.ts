/**
 * Quick script to check pricing data status
 * Run this to verify pricing data is in the database
 */

import { getPricingDataFromDb, getPricingDataInfo } from '@/services/pricing-db-service';

async function checkPricingData() {
  console.log('🔍 Checking pricing data status...\n');
  
  try {
    // Get pricing info
    const info = await getPricingDataInfo();
    
    if (!info) {
      console.error('❌ No pricing data found in database!');
      console.log('\n📝 Action Required:');
      console.log('1. Go to admin panel');
      console.log('2. Run pricing sync from Google Sheets');
      console.log('3. Verify sync completed successfully\n');
      return;
    }
    
    console.log('✅ Pricing data found in database:\n');
    console.log(`   Version: ${info.version}`);
    console.log(`   Synced At: ${info.syncedAt.toISOString()}`);
    console.log(`   Synced By: ${info.syncedBy}`);
    console.log(`   Age: ${Math.round((Date.now() - info.syncedAt.getTime()) / 1000 / 60)} minutes\n`);
    
    // Get actual pricing data
    const pricingData = await getPricingDataFromDb();
    
    if (!pricingData) {
      console.error('❌ Pricing data exists but is empty!');
      return;
    }
    
    console.log('📊 Pricing Data Sample:\n');
    console.log(`   Nest 80 price: €${(pricingData.nest.nest80.price / 100).toFixed(2)}`);
    console.log(`   Nest 100 price: €${(pricingData.nest.nest100.price / 100).toFixed(2)}`);
    console.log(`   Nest 120 price: €${(pricingData.nest.nest120.price / 100).toFixed(2)}`);
    console.log(`   PV Module (Nest 80): €${(pricingData.pvanlage.pricePerModule.nest80 / 100).toFixed(2)}`);
    console.log(`   Geschossdecke base: €${(pricingData.geschossdecke.basePrice / 100).toFixed(2)}`);
    
    console.log('\n✅ Pricing data looks good!\n');
    
  } catch (error) {
    console.error('❌ Error checking pricing data:', error);
    console.log('\n📝 This might indicate:');
    console.log('- Database connection issue');
    console.log('- Pricing data never synced');
    console.log('- Schema mismatch\n');
  }
}

// Run if called directly
if (require.main === module) {
  checkPricingData().then(() => process.exit(0)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export { checkPricingData };
