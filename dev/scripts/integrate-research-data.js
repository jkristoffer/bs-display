#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load schema
const schemaPath = path.join(__dirname, '../src/data/schema.smartboards.v3.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

// Initialize AJV validator
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

// Brands to integrate
const BRANDS = ['benq', 'clevertouch', 'dell', 'lg', 'promethean', 'samsung', 'viewsonic'];

// Default values for missing required fields
const DEFAULTS = {
  warranty: '3 years',
  priceRange: '$2,000 - $3,000',
  image: '/assets/models/placeholder.png'
};

/**
 * Transform "N/A" values to appropriate defaults or remove optional fields
 */
function transformData(data) {
  const transformed = { ...data };
  
  // Handle required fields with defaults
  Object.keys(DEFAULTS).forEach(key => {
    if (!transformed[key] || transformed[key] === 'N/A') {
      transformed[key] = DEFAULTS[key];
    }
  });
  
  // Fix powerConsumption format (must match pattern: number+W or "Not specified")
  if (transformed.powerConsumption) {
    if (transformed.powerConsumption === 'N/A' || transformed.powerConsumption === '0.3W') {
      delete transformed.powerConsumption;
    } else if (!transformed.powerConsumption.match(/^[0-9]+W$/)) {
      // Try to extract number and add W
      const match = transformed.powerConsumption.match(/(\d+)/);
      if (match) {
        transformed.powerConsumption = match[1] + 'W';
      } else {
        delete transformed.powerConsumption;
      }
    }
  }
  
  // Fix contrastRatio format
  if (transformed.contrastRatio && !transformed.contrastRatio.match(/^([0-9]+:[0-9]+|Not specified)$/)) {
    delete transformed.contrastRatio;
  }
  
  // Remove optional fields with "N/A" values or empty arrays
  Object.keys(transformed).forEach(key => {
    if (transformed[key] === 'N/A' && !schema.items.required.includes(key)) {
      delete transformed[key];
    }
    // Remove empty certifications arrays
    if (key === 'certifications' && Array.isArray(transformed[key]) && 
        (transformed[key].length === 0 || transformed[key][0] === 'N/A')) {
      delete transformed[key];
    }
  });
  
  // Ensure brand name matches expected format
  if (transformed.brand) {
    transformed.brand = transformed.brand.charAt(0).toUpperCase() + 
                       transformed.brand.slice(1).toLowerCase();
  }
  
  // Ensure OS is not N/A (required field)
  if (transformed.os === 'N/A') {
    transformed.os = 'Display Only';
  }
  
  return transformed;
}

/**
 * Read all product files for a brand from research folder
 */
function readBrandProducts(brand) {
  const brandPath = path.join(__dirname, '../src/data/research', brand);
  const products = [];
  
  try {
    const files = fs.readdirSync(brandPath);
    
    files.forEach(file => {
      if (file.endsWith('.json') && file !== `${brand}.json`) {
        const filePath = path.join(brandPath, file);
        try {
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          // Skip files that don't have the expected structure
          if (data.id && data.model) {
            const transformed = transformData(data);
            products.push(transformed);
          }
        } catch (parseErr) {
          console.error(`Error parsing ${file}:`, parseErr.message);
        }
      }
    });
  } catch (err) {
    console.error(`Error reading ${brand} products:`, err.message);
  }
  
  return products;
}

/**
 * Validate products against schema
 */
function validateProducts(products, brand) {
  const valid = validate(products);
  
  if (!valid) {
    console.error(`Validation errors for ${brand}:`);
    console.error(JSON.stringify(validate.errors, null, 2));
    return false;
  }
  
  return true;
}

/**
 * Write validated products to main data folder
 */
function writeProducts(products, brand) {
  const outputPath = path.join(__dirname, '../src/data', `models.${brand}.json`);
  
  try {
    fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
    console.log(`✅ Successfully wrote ${products.length} ${brand} products to ${outputPath}`);
    return true;
  } catch (err) {
    console.error(`❌ Error writing ${brand} products:`, err.message);
    return false;
  }
}

/**
 * Main integration function
 */
async function integrateResearchData() {
  console.log('🚀 Starting integration of research data...\n');
  
  const results = {
    success: [],
    failed: []
  };
  
  for (const brand of BRANDS) {
    console.log(`\n📦 Processing ${brand}...`);
    
    // Read all products for brand
    const products = readBrandProducts(brand);
    
    if (products.length === 0) {
      console.log(`⚠️  No products found for ${brand}`);
      results.failed.push(brand);
      continue;
    }
    
    console.log(`📊 Found ${products.length} products`);
    
    // Validate against schema
    if (!validateProducts(products, brand)) {
      results.failed.push(brand);
      continue;
    }
    
    console.log(`✓ All products validated successfully`);
    
    // Write to main data folder
    if (writeProducts(products, brand)) {
      results.success.push(brand);
    } else {
      results.failed.push(brand);
    }
  }
  
  // Summary
  console.log('\n\n📋 Integration Summary:');
  console.log(`✅ Successfully integrated: ${results.success.join(', ') || 'None'}`);
  console.log(`❌ Failed to integrate: ${results.failed.join(', ') || 'None'}`);
  
  // Generate update for models.all.js
  if (results.success.length > 0) {
    generateModelsAllUpdate(results.success);
  }
}

/**
 * Generate code to update models.all.js
 */
function generateModelsAllUpdate(brands) {
  console.log('\n\n📝 Add these imports to models.all.js:');
  console.log('```javascript');
  
  brands.forEach(brand => {
    console.log(`import ${brand}Models from './models.${brand}.json';`);
  });
  
  console.log('\n// Add to exports:');
  brands.forEach(brand => {
    console.log(`    ${brand}Models,`);
  });
  
  console.log('\n// Add to allModels array:');
  brands.forEach(brand => {
    console.log(`    ...${brand}Models,`);
  });
  
  console.log('```');
}

// Run the integration
integrateResearchData().catch(console.error);