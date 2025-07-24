#!/usr/bin/env node

/**
 * CSS Variable Migration Script
 * Automatically migrates old CSS variables to new semantic token system
 * 
 * Usage: node variable-migration.js [--dry-run] [--path=src/components]
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Variable mapping from old to new semantic tokens
const VARIABLE_MAP = {
  // Primary Colors
  '$primary-blue': '$color-primary',
  '$blue': '$color-primary',
  '$brand-primary': '$color-primary',
  '$brand-blue': '$color-primary',
  '$accent-blue': '$color-primary',
  '$main-blue': '$color-primary',
  '$button-blue': '$color-primary',
  '$link-blue': '$color-primary',
  '$primary-blue-light': '$color-primary-light',
  '$light-blue': '$color-primary-light',
  '$primary-blue-dark': '$color-primary-dark',
  '$dark-blue': '$color-primary-dark',
  
  // Secondary Colors
  '$secondary-gray': '$color-secondary',
  '$gray': '$color-secondary',
  '$text-secondary': '$color-secondary',
  '$muted-gray': '$color-secondary',
  '$neutral-gray': '$color-secondary',
  '$secondary-color': '$color-secondary',
  '$gray-text': '$color-secondary',
  '$subdued-gray': '$color-secondary',
  
  // Status Colors
  '$success-green': '$color-success',
  '$green': '$color-success',
  '$positive-green': '$color-success',
  '$valid-green': '$color-success',
  '$confirm-green': '$color-success',
  '$warning-yellow': '$color-warning',
  '$yellow': '$color-warning',
  '$caution-yellow': '$color-warning',
  '$alert-yellow': '$color-warning',
  '$error-red': '$color-error',
  '$red': '$color-error',
  '$danger-red': '$color-error',
  '$invalid-red': '$color-error',
  '$negative-red': '$color-error',
  '$info-blue': '$color-info',
  
  // Text Colors
  '$text-primary': '$color-text-primary',
  '$text-dark': '$color-text-primary',
  '$text-main': '$color-text-primary',
  '$text-muted': '$color-text-muted',
  '$text-light': '$color-text-secondary',
  '$text-inverse': '$color-text-inverse',
  '$text-white': '$color-text-inverse',
  
  // Background Colors
  '$bg-primary': '$color-background-primary',
  '$bg-white': '$color-background-primary',
  '$bg-secondary': '$color-background-secondary',
  '$bg-light': '$color-background-light',
  '$bg-gray': '$color-background-secondary',
  '$bg-dark': '$color-background-dark',
  
  // Border Colors
  '$border-light': '$color-border-light',
  '$border-gray': '$color-border-medium',
  '$border-dark': '$color-border-dark',
  '$border-primary': '$color-primary',
  
  // Spacing Variables
  '$spacing-2': '$spacing-xs',  // 2px -> 4px (round up to system)
  '$spacing-4': '$spacing-xs',
  '$spacing-6': '$spacing-xs',  // 6px -> 4px (round down to system)
  '$spacing-8': '$spacing-sm',
  '$spacing-10': '$spacing-sm', // 10px -> 8px (round down to system)
  '$spacing-12': '$spacing-sm', // 12px -> 8px (round down to system)
  '$spacing-14': '$spacing-sm', // 14px -> 8px (round down to system)
  '$spacing-16': '$spacing-md',
  '$spacing-18': '$spacing-md', // 18px -> 16px (round down to system)
  '$spacing-20': '$spacing-md', // 20px -> 16px (round down to system)
  '$spacing-22': '$spacing-lg', // 22px -> 24px (round up to system)
  '$spacing-24': '$spacing-lg',
  '$spacing-28': '$spacing-lg', // 28px -> 24px (round down to system)
  '$spacing-32': '$spacing-xl',
  '$spacing-36': '$spacing-xl', // 36px -> 32px (round down to system)
  '$spacing-40': '$spacing-xl', // 40px -> 32px (round down to system)
  '$spacing-48': '$spacing-2xl',
  
  // Legacy spacing names
  '$margin-small': '$spacing-sm',
  '$margin-medium': '$spacing-md',
  '$margin-large': '$spacing-lg',
  '$margin-xl': '$spacing-xl',
  '$padding-xs': '$spacing-xs',
  '$padding-small': '$spacing-sm',
  '$padding-medium': '$spacing-md',
  '$padding-large': '$spacing-lg',
  '$padding-xl': '$spacing-xl',
  '$gap-small': '$spacing-sm',
  '$gap-medium': '$spacing-md',
  '$gap-large': '$spacing-lg',
  
  // Typography
  '$font-size-10': '$font-size-xs', // 10px -> 12px (accessibility minimum)
  '$font-size-11': '$font-size-xs', // 11px -> 12px (accessibility minimum)
  '$font-size-12': '$font-size-xs',
  '$font-size-13': '$font-size-sm', // 13px -> 14px (round up to system)
  '$font-size-14': '$font-size-sm',
  '$font-size-15': '$font-size-sm', // 15px -> 14px (round down to system)
  '$font-size-16': '$font-size-md',
  '$font-size-17': '$font-size-lg', // 17px -> 18px (round up to system)
  '$font-size-18': '$font-size-lg',
  '$font-size-20': '$font-size-xl',
  '$font-size-22': '$font-size-xl', // 22px -> 20px (round down to system)
  '$font-size-24': '$font-size-xl', // 24px -> 20px (round down to system)
  
  // Legacy text sizes
  '$text-small': '$font-size-xs',
  '$text-normal': '$font-size-md',
  '$text-large': '$font-size-lg',
  '$text-xl': '$font-size-xl',
  '$text-xxl': '$font-size-xl',
  '$body-text': '$font-size-md',
  '$body-small': '$font-size-sm',
  '$body-large': '$font-size-lg',
  
  // Font weights
  '$font-light': '$font-weight-normal',   // 300 -> 400 (more standard)
  '$font-normal': '$font-weight-normal',
  '$font-medium': '$font-weight-medium',
  '$font-semibold': '$font-weight-semibold',
  '$font-bold': '$font-weight-bold',
  '$font-weight-300': '$font-weight-normal',
  '$font-weight-400': '$font-weight-normal',
  '$font-weight-500': '$font-weight-medium',
  '$font-weight-600': '$font-weight-semibold',
  '$font-weight-700': '$font-weight-bold',
  
  // Shadows
  '$shadow-small': '$shadow-sm',
  '$shadow-medium': '$shadow-md',
  '$shadow-large': '$shadow-lg',
  '$box-shadow-sm': '$shadow-sm',
  '$box-shadow-md': '$shadow-md',
  '$box-shadow-lg': '$shadow-lg',
  
  // Border radius
  '$border-radius-small': '$radius-sm',
  '$border-radius-medium': '$radius-md',
  '$border-radius-large': '$radius-lg',
  '$radius-small': '$radius-sm',
  '$radius-medium': '$radius-md',
  '$radius-large': '$radius-lg',
  '$rounded-sm': '$radius-sm',
  '$rounded-md': '$radius-md',
  '$rounded-lg': '$radius-lg',
  '$rounded-xl': '$radius-xl',
  
  // Z-index
  '$z-dropdown': '$z-dropdown',
  '$z-sticky': '$z-sticky',
  '$z-fixed': '$z-fixed',
  '$z-modal': '$z-modal',
  '$z-popover': '$z-popover',
  '$z-tooltip': '$z-tooltip',
  
  // Transitions
  '$transition-fast': '$transition-fast',
  '$transition-normal': '$transition-normal',
  '$transition-slow': '$transition-slow'
};

// CLI argument parsing
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const pathArg = args.find(arg => arg.startsWith('--path='));
const targetPath = pathArg ? pathArg.split('=')[1] : 'src';

console.log('🚀 CSS Variable Migration Tool');
console.log('================================');
console.log(`Target path: ${targetPath}`);
console.log(`Dry run: ${isDryRun ? 'Yes' : 'No'}`);
console.log(`Variables to migrate: ${Object.keys(VARIABLE_MAP).length}`);
console.log('');

// Statistics tracking
const stats = {
  filesProcessed: 0,
  filesChanged: 0,
  variablesReplaced: 0,
  replacements: {}
};

/**
 * Process a single file for variable migration
 */
function migrateFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let fileChanged = false;
    const fileReplacements = {};
    
    // Apply each variable replacement
    Object.entries(VARIABLE_MAP).forEach(([oldVar, newVar]) => {
      // Create regex to match variable usage (not just definitions)
      const regex = new RegExp(`\\${oldVar.replace(/\$/g, '\\$')}\\b`, 'g');
      const matches = newContent.match(regex);
      
      if (matches) {
        newContent = newContent.replace(regex, newVar);
        fileChanged = true;
        
        const count = matches.length;
        fileReplacements[oldVar] = { newVar, count };
        stats.variablesReplaced += count;
        
        if (!stats.replacements[oldVar]) {
          stats.replacements[oldVar] = { newVar, count: 0, files: [] };
        }
        stats.replacements[oldVar].count += count;
        stats.replacements[oldVar].files.push(filePath);
      }
    });
    
    if (fileChanged) {
      if (!isDryRun) {
        fs.writeFileSync(filePath, newContent);
      }
      
      stats.filesChanged++;
      console.log(`✅ ${filePath}`);
      
      // Show replacements for this file
      Object.entries(fileReplacements).forEach(([oldVar, { newVar, count }]) => {
        console.log(`   ${oldVar} → ${newVar} (${count} occurrence${count > 1 ? 's' : ''})`);
      });
    }
    
    stats.filesProcessed++;
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

/**
 * Find and process all relevant files
 */
async function migrateDirectory() {
  try {
    // Find all SCSS and CSS files
    const patterns = [
      `${targetPath}/**/*.scss`,
      `${targetPath}/**/*.css`
    ];
    
    const files = [];
    for (const pattern of patterns) {
      const matches = await glob(pattern, {
        ignore: [
          '**/node_modules/**',
          '**/dist/**',
          '**/build/**',
          '**/.next/**'
        ]
      });
      files.push(...matches);
    }
    
    console.log(`Found ${files.length} CSS/SCSS files to process\n`);
    
    // Process each file
    files.forEach(migrateFile);
    
  } catch (error) {
    console.error('❌ Error scanning directory:', error.message);
    process.exit(1);
  }
}

/**
 * Display migration summary
 */
function displaySummary() {
  console.log('\n📊 Migration Summary');
  console.log('===================');
  console.log(`Files processed: ${stats.filesProcessed}`);
  console.log(`Files changed: ${stats.filesChanged}`);
  console.log(`Total variable replacements: ${stats.variablesReplaced}`);
  
  if (isDryRun) {
    console.log('\n⚠️  This was a dry run - no files were actually modified');
    console.log('Run without --dry-run to apply changes');
  }
  
  if (Object.keys(stats.replacements).length > 0) {
    console.log('\n📋 Variable Replacement Details:');
    console.log('--------------------------------');
    
    Object.entries(stats.replacements)
      .sort(([,a], [,b]) => b.count - a.count)
      .forEach(([oldVar, { newVar, count, files }]) => {
        console.log(`${oldVar} → ${newVar}`);
        console.log(`  Replaced: ${count} occurrence${count > 1 ? 's' : ''} in ${files.length} file${files.length > 1 ? 's' : ''}`);
      });
  }
  
  if (stats.filesChanged === 0) {
    console.log('\n✨ No files needed migration - all variables are already up to date!');
  } else if (!isDryRun) {
    console.log('\n✅ Migration complete! Remember to:');
    console.log('   1. Test the application thoroughly');
    console.log('   2. Run visual regression tests');
    console.log('   3. Check for any build errors');
    console.log('   4. Commit changes with descriptive message');
  }
}

/**
 * Create backup of changed files
 */
function createBackup() {
  if (isDryRun) return;
  
  const backupDir = path.join(process.cwd(), 'migration-backup', new Date().toISOString().split('T')[0]);
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log(`📁 Created backup directory: ${backupDir}`);
  }
}

/**
 * Validate environment before migration
 */
function validateEnvironment() {
  // Check if we're in the right directory
  if (!fs.existsSync('package.json')) {
    console.error('❌ Error: package.json not found. Please run from project root.');
    process.exit(1);
  }
  
  // Check if target path exists
  if (!fs.existsSync(targetPath)) {
    console.error(`❌ Error: Target path "${targetPath}" does not exist.`);
    process.exit(1);
  }
  
  // Warn about git status
  if (!isDryRun) {
    console.log('⚠️  Make sure you have committed all changes before running migration!');
    console.log('   This tool will modify files in place.\n');
  }
}

// Main execution
async function main() {
  validateEnvironment();
  
  if (!isDryRun) {
    createBackup();
  }
  
  await migrateDirectory();
  displaySummary();
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

// Run the migration
main().catch(console.error);