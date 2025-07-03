#!/usr/bin/env node

/**
 * JSON Schema Validation Tool
 * 
 * Validates JSON data files against their corresponding schemas using AJV.
 * Supports validation of product model files against schema definitions.
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

// Initialize AJV with validation options
const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  strict: false
});

/**
 * Load and parse JSON file
 * @param {string} filePath - Path to JSON file
 * @returns {Object} Parsed JSON data
 */
function loadJsonFile(filePath) {
  try {
    const fullPath = resolve(projectRoot, filePath);
    const content = readFileSync(fullPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to load JSON file '${filePath}': ${error.message}`);
  }
}

/**
 * Validate JSON data against schema
 * @param {Object} data - JSON data to validate
 * @param {Object} schema - JSON schema
 * @param {string} dataFile - Name of data file (for reporting)
 * @returns {Object} Validation result
 */
function validateJson(data, schema, dataFile) {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  
  return {
    valid,
    errors: validate.errors,
    dataFile,
    errorCount: validate.errors ? validate.errors.length : 0
  };
}

/**
 * Format validation errors for display
 * @param {Array} errors - AJV validation errors
 * @returns {string} Formatted error message
 */
function formatErrors(errors) {
  if (!errors || errors.length === 0) return '';
  
  return errors.map(error => {
    const path = error.instancePath || 'root';
    const message = error.message;
    const data = error.data ? ` (received: ${JSON.stringify(error.data)})` : '';
    return `  ❌ ${path}: ${message}${data}`;
  }).join('\n');
}

/**
 * Main validation function
 */
async function main() {
  const args = process.argv.slice(2);
  
  // Default validation configurations
  const validationConfigs = [
    {
      dataFile: 'src/data/models.maxhub.json',
      schemaFile: 'src/data/schema.smartboards.v3.json',
      description: 'MAXHUB smartboard models'
    },
    {
      dataFile: 'src/data/models.metz.json',
      schemaFile: 'src/data/schema.smartboards.v3.json',
      description: 'METZ smartboard models'
    },
    {
      dataFile: 'src/data/models.elon.json',
      schemaFile: 'src/data/schema.smartboards.v3.json',
      description: 'ELON smartboard models'
    },
    {
      dataFile: 'src/data/lecterns.maxhub.json',
      schemaFile: 'src/data/schema.lecterns.json',
      description: 'MAXHUB lectern models'
    }
  ];

  // Parse command line arguments
  let configsToRun = validationConfigs;
  
  if (args.length > 0) {
    const filter = args[0].toLowerCase();
    configsToRun = validationConfigs.filter(config => 
      config.dataFile.toLowerCase().includes(filter) ||
      config.description.toLowerCase().includes(filter)
    );
    
    if (configsToRun.length === 0) {
      console.log(`❌ No validation configs match filter: ${filter}`);
      console.log('\nAvailable validations:');
      validationConfigs.forEach(config => {
        console.log(`  - ${config.description} (${config.dataFile})`);
      });
      process.exit(1);
    }
  }

  console.log('🔍 JSON Schema Validation');
  console.log('========================\n');
  
  let totalValidations = 0;
  let successfulValidations = 0;
  let totalErrors = 0;

  // Run validations
  for (const config of configsToRun) {
    totalValidations++;
    
    try {
      console.log(`📄 Validating ${config.description}...`);
      console.log(`   Data: ${config.dataFile}`);
      console.log(`   Schema: ${config.schemaFile}`);
      
      // Load files
      const data = loadJsonFile(config.dataFile);
      const schema = loadJsonFile(config.schemaFile);
      
      // Validate
      const result = validateJson(data, schema, config.dataFile);
      
      if (result.valid) {
        console.log(`   ✅ Valid (${Array.isArray(data) ? data.length : 1} items validated)`);
        successfulValidations++;
      } else {
        console.log(`   ❌ Invalid (${result.errorCount} errors found)`);
        console.log(formatErrors(result.errors));
        totalErrors += result.errorCount;
      }
      
    } catch (error) {
      console.log(`   ❌ Validation failed: ${error.message}`);
      totalErrors++;
    }
    
    console.log(''); // Empty line for spacing
  }
  
  // Summary
  console.log('📊 Validation Summary:');
  console.log(`   Total validations: ${totalValidations}`);
  console.log(`   Successful: ${successfulValidations} ✅`);
  console.log(`   Failed: ${totalValidations - successfulValidations} ❌`);
  console.log(`   Total errors: ${totalErrors}`);
  
  if (totalErrors === 0) {
    console.log('\n🎉 All validations passed!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some validations failed. Please fix the errors above.');
    process.exit(1);
  }
}

// Handle specific file validation
if (process.argv.includes('--file')) {
  const fileIndex = process.argv.indexOf('--file') + 1;
  const schemaIndex = process.argv.indexOf('--schema') + 1;
  
  if (fileIndex < process.argv.length && schemaIndex < process.argv.length) {
    const dataFile = process.argv[fileIndex];
    const schemaFile = process.argv[schemaIndex];
    
    try {
      console.log(`🔍 Validating ${dataFile} against ${schemaFile}...`);
      
      const data = loadJsonFile(dataFile);
      const schema = loadJsonFile(schemaFile);
      const result = validateJson(data, schema, dataFile);
      
      if (result.valid) {
        console.log('✅ Validation successful!');
        process.exit(0);
      } else {
        console.log('❌ Validation failed:');
        console.log(formatErrors(result.errors));
        process.exit(1);
      }
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  } else {
    console.error('❌ Usage: --file <data-file> --schema <schema-file>');
    process.exit(1);
  }
} else {
  // Run main validation
  main().catch(error => {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  });
}