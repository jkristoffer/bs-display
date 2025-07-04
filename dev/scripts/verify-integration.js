#!/usr/bin/env node
import { allModels } from '../src/data/models.all.js';

console.log('🔍 Verifying Integration Results:\n');

// Count products by brand
const brandCounts = {};
allModels.forEach(model => {
  brandCounts[model.brand] = (brandCounts[model.brand] || 0) + 1;
});

// Display results
console.log('📊 Product counts by brand:');
Object.entries(brandCounts).sort().forEach(([brand, count]) => {
  console.log(`   ${brand}: ${count} products`);
});

console.log(`\n✅ Total products: ${allModels.length}`);

// Check for any missing required fields
console.log('\n🔎 Checking data integrity...');
const requiredFields = ['id', 'brand', 'model', 'size', 'resolution', 'os', 'touchTechnology', 'features', 'warranty', 'priceRange', 'image'];
let issues = 0;

allModels.forEach(model => {
  requiredFields.forEach(field => {
    if (!model[field]) {
      console.log(`   ⚠️  Missing ${field} in ${model.id || 'unknown product'}`);
      issues++;
    }
  });
});

if (issues === 0) {
  console.log('   ✓ All required fields present');
} else {
  console.log(`   ❌ Found ${issues} missing fields`);
}

// Sample product display
console.log('\n📦 Sample product (first from each new brand):');
const newBrands = ['Benq', 'Clevertouch', 'Dell', 'Lg', 'Promethean', 'Samsung', 'Viewsonic'];
newBrands.forEach(brand => {
  const product = allModels.find(m => m.brand === brand);
  if (product) {
    console.log(`\n   ${brand}: ${product.model}`);
    console.log(`   - Size: ${product.size}"`);
    console.log(`   - Resolution: ${product.resolution}`);
    console.log(`   - Price: ${product.priceRange}`);
  }
});