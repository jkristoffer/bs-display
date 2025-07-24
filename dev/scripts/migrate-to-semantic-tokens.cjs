const fs = require('fs');
const path = require('path');

// Complete variable mapping based on Day 6 analysis (327 variables analyzed)
const VARIABLE_MIGRATION_MAP = {
  // ===== HIGH-IMPACT MIGRATIONS (>50 occurrences each) =====
  
  // Primary Colors (191 occurrences across 41 files - highest usage)
  '--color-accent-primary': '--color-primary',
  '--color-accent-primary-rgb': 'DELETE', // Use color-mix() instead (129 occurrences)
  
  // Spacing System (400+ total occurrences - Day 6 top variables)
  '--spacing-md': '--spacing-8',           // 187 occurrences → 16px
  '--spacing-lg': '--spacing-12',          // 133 occurrences → 24px  
  '--spacing-sm': '--spacing-4',           // 131 occurrences → 8px
  '--spacing-xl': '--spacing-16',          // 81 occurrences → 32px
  '--spacing-xs': '--spacing-2',           // 78 occurrences → 4px
  
  // Typography System (150+ occurrences - Day 6 analysis)
  '--font-size-body-regular': '--text-body',  // 54 occurrences
  '--font-size-small': '--text-small',        // 50 occurrences
  '--font-size-h1': '--text-hero',
  '--font-size-h2': '--text-section',
  '--font-size-h3': '--text-subsection',
  '--font-size-h4': '--text-subsection',
  '--font-size-subtitle': '--text-subsection',
  '--font-size-body-large': '--text-body',
  '--font-size-body-small': '--text-small',
  '--font-size-caption': '--text-caption',
  '--font-size-micro': '--text-micro',
  
  // ===== MEDIUM-IMPACT MIGRATIONS (10-50 occurrences each) =====
  
  // Admin Colors → Main System Integration (Day 6: 48 occurrences admin-text)
  '--color-admin-text': '--color-text-primary',           
  '--color-admin-text-secondary': '--color-text-secondary',
  '--color-admin-bg': '--color-background',
  '--color-admin-surface': '--color-surface',
  '--color-admin-border': '--color-border-muted',
  
  // Button System Consolidation (Day 6: 16 → 6 variables)
  '--color-button-ghost-border': '--color-button-primary',
  '--color-button-ghost-text': '--color-button-primary',
  '--color-button-primary-background': '--color-button-primary',
  '--color-button-primary-text': '--color-text-inverse',
  '--color-button-primary-hover': '--color-primary-hover',
  '--color-button-primary-active': '--color-primary-active',
  '--color-button-secondary-background': '--color-button-secondary',
  '--color-button-secondary-text': '--color-text-inverse',
  '--color-button-disabled-border': '--color-border-muted',
  '--color-button-disabled-text': '--color-text-muted',
  '--color-button-disabled-background': '--color-button-disabled',
  
  // Font System Cleanup (Day 6: deprecated aliases)
  '--font-primary': 'DELETE',   // Use --font-body instead
  '--font-secondary': 'DELETE', // Use --font-heading instead
  
  // Legacy Typography Removal (Day 6: 24 legacy variables)
  '--font-size-h1-legacy': '--text-hero',
  '--font-size-h2-legacy': '--text-section',
  '--font-size-h3-legacy': '--text-subsection',
  '--font-size-h4-legacy': '--text-subsection',
  '--font-size-body-large-legacy': '--text-body',
  '--font-size-body-regular-legacy': '--text-body',
  '--font-size-body-small-legacy': '--text-small',
  '--font-size-caption-legacy': '--text-caption',
  '--font-size-micro-legacy': '--text-micro',
  
  // Navigation-specific Sizes (Day 6: convert to semantic)
  '--font-size-nav-primary': '--text-body',
  '--font-size-nav-secondary': '--text-small',
  
  // ===== LOW-IMPACT MIGRATIONS (<10 occurrences each) =====
  
  // Spacing Duplicates (Day 6: 5 duplicate groups identified)
  '--spacing-container-padding': '--spacing-8',
  '--spacing-component-gap': '--spacing-12', 
  '--spacing-section-gap': '--spacing-24',
  '--spacing-card-padding': '--spacing-12',
  '--spacing-gap-between-blocks': '--spacing-12',
  
  // Semantic Spacing Aliases → Numeric (Day 6: remove semantic layer)
  '--spacing-xxl': '--spacing-24',
  
  // Line Height System (Day 6: consolidate to fewer variables)
  '--line-height-tight': '1.25',     // Direct value
  '--line-height-headers': '1.25',   // Direct value  
  '--line-height-body': '1.5',       // Direct value
  '--line-height-relaxed': '1.6',    // Direct value
  
  // Font Weight Consolidation (Day 6: remove light weight)
  '--font-weight-light': '--font-weight-normal',
  '--font-weight-regular': '--font-weight-normal',
  
  // Letter Spacing (Day 6: low usage, use direct values)
  '--letter-spacing-tight': '-0.025em',
  '--letter-spacing-normal': '0',
  '--letter-spacing-wide': '0.025em',
  '--letter-spacing-wider': '0.05em',
  
  // Shadow System (Day 6: consolidate legacy variants)
  '--box-shadow-1': '--shadow-md',
  '--box-shadow-card': '--shadow-sm',
  '--box-shadow-card-hover': '--shadow-md',
  '--shadow-accent': '--shadow-md',
  '--shadow-accent-lg': '--shadow-lg',
  
  // Border Radius (Day 6: standardize to single scale)
  '--border-radius-small': '--radius-md',
  '--border-radius-card': '--radius-xl',
  '--border-radius-button': '--radius-lg',
  '--border-radius-lg': '--radius-xl',
  '--border-radius-md': '--radius-lg',
  '--border-radius-sm': '--radius-md',
  
  // Z-Index System (Day 6: remove navigation-specific variants)
  '--z-nav-primary': '--z-navigation',
  '--z-nav-secondary': '--z-navigation',
  '--z-nav-dropdown': '--z-dropdown',
  
  // Animation System (Day 6: simplify to essential)
  '--duration-fast': '150ms',  // Direct value, not variable
  '--duration-slow': '600ms',  // Direct value, not variable
  
  // Breakpoint System (Day 6: use direct values or CSS custom media)
  '--breakpoint-sm': '576px',
  '--breakpoint-md': '768px', 
  '--breakpoint-lg': '992px',
  '--breakpoint-xl': '1200px',
  
  // Chart Colors (Day 6: map to semantic equivalents)
  '--chart-danger': '--color-error',
  '--chart-primary': '--color-primary',
  '--chart-secondary': '--color-success',
  '--chart-tertiary': '--color-warning',
  '--chart-quaternary': '--color-info',
  
  // Color System Consolidation (Day 6: resolve conflicts)
  '--color-accent-secondary-dark': '--color-secondary',
  '--color-accent-secondary-new': '--color-secondary',
  '--color-accent-secondary-rgb': 'DELETE',
  
  // Text Colors (Day 6: consolidate variants)
  '--color-text-secondary': '--color-text-secondary', // Keep as base
  '--color-surface-muted': '--color-surface-muted',   // Keep as base
  '--color-border-light': '--color-border-muted',
  '--color-border-strong': '--color-border-strong',   // Keep as base
  
  // Success/Warning/Error System (Day 6: consolidate *-new variants)
  '--color-success-new': '--color-success',
  '--color-warning-new': '--color-warning', 
  '--color-error-new': '--color-error',
  '--color-info-new': '--color-info',
};

const VALUE_REPLACEMENTS = {
  // Resolve spacing value conflicts from Day 6 duplicate analysis
  'var(--spacing-md)': 'var(--spacing-8)',
  'var(--spacing-lg)': 'var(--spacing-12)',
  'var(--spacing-sm)': 'var(--spacing-4)',
  'var(--spacing-xl)': 'var(--spacing-16)',
  'var(--spacing-xs)': 'var(--spacing-2)',
  
  // Typography value replacements (Day 6: specific clamp values)
  'clamp(14px, 1.75vw, 16px)': 'var(--text-body)',
  'clamp(32px, 5vw, 48px)': 'var(--text-hero)',
  'clamp(28px, 4vw, 36px)': 'var(--text-section)',
  'clamp(24px, 3.5vw, 32px)': 'var(--text-subsection)',
  
  // Remove RGB variants (Day 6: 129 occurrences of accent-primary-rgb)
  'var(--color-accent-primary-rgb)': 'var(--color-primary)',
  'var(--color-accent-secondary-rgb)': 'var(--color-secondary)',
  
  // Admin spacing aliases (Day 6: integrate admin system)
  'var(--admin-spacing-lg)': 'var(--spacing-12)',
  'var(--admin-spacing-md)': 'var(--spacing-8)',
  'var(--admin-spacing-sm)': 'var(--spacing-4)',
  'var(--admin-spacing-xl)': 'var(--spacing-16)',
  'var(--admin-spacing-xs)': 'var(--spacing-2)',
};

function migrateFile(filePath, dryRun = false) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;
  const changeLog = [];
  
  // Apply variable replacements
  Object.entries(VARIABLE_MIGRATION_MAP).forEach(([oldVar, newVar]) => {
    if (newVar === 'DELETE') {
      // Handle deletion - warn about usage but don't modify
      const regex = new RegExp(`var\\(${oldVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g');
      if (regex.test(content)) {
        console.warn(`⚠️  WARNING: ${filePath} uses deleted variable ${oldVar} - manual review needed`);
        changeLog.push(`DELETION WARNING: ${oldVar} found but not automatically removed`);
      }
      return;
    }
    
    // Replace variable references: var(--old-var) → var(--new-var)
    const varRegex = new RegExp(`var\\(${oldVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g');
    const varMatches = content.match(varRegex);
    if (varMatches) {
      content = content.replace(varRegex, `var(${newVar})`);
      changes += varMatches.length;
      changeLog.push(`${varMatches.length}x var(${oldVar}) → var(${newVar})`);
    }
    
    // Replace direct variable references: --old-var → --new-var (in definitions)
    const directRegex = new RegExp(`\\b${oldVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
    const directMatches = content.match(directRegex);
    if (directMatches) {
      content = content.replace(directRegex, newVar);
      changes += directMatches.length;
      changeLog.push(`${directMatches.length}x ${oldVar} → ${newVar}`);
    }
  });
  
  // Apply value replacements
  Object.entries(VALUE_REPLACEMENTS).forEach(([oldValue, newValue]) => {
    const regex = new RegExp(oldValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, newValue);
      changes += matches.length;
      changeLog.push(`${matches.length}x value "${oldValue}" → "${newValue}"`);
    }
  });
  
  if (changes > 0 && !dryRun) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Migrated ${filePath}: ${changes} changes`);
    if (changeLog.length > 0 && process.env.DEBUG) {
      changeLog.forEach(log => console.log(`   - ${log}`));
    }
  } else if (changes > 0 && dryRun) {
    console.log(`🔍 DRY RUN ${filePath}: ${changes} potential changes`);
    if (changeLog.length > 0) {
      changeLog.forEach(log => console.log(`   - ${log}`));
    }
  }
  
  return { changes, changeLog };
}

function migrateAllFiles(dryRun = false) {
  const { glob } = require('glob');
  
  const filePatterns = [
    'src/**/*.scss',
    'src/**/*.css', 
    'src/**/*.tsx',
    'src/**/*.astro'
  ];
  
  let totalFiles = 0;
  let totalChanges = 0;
  let allChangeLogs = {};
  
  filePatterns.forEach(pattern => {
    try {
      const files = glob.sync(pattern);
      files.forEach(file => {
        const result = migrateFile(file, dryRun);
        if (result.changes > 0) {
          totalFiles++;
          totalChanges += result.changes;
          allChangeLogs[file] = result.changeLog;
        }
      });
    } catch (error) {
      console.error(`Error processing pattern ${pattern}:`, error.message);
    }
  });
  
  console.log(`\n🎉 Migration ${dryRun ? 'analysis' : 'complete'}:`);
  console.log(`- Files ${dryRun ? 'to update' : 'updated'}: ${totalFiles}`);
  console.log(`- Total changes: ${totalChanges}`);
  
  if (dryRun) {
    console.log('\n📊 Migration Impact Summary:');
    console.log(`- Variable migrations: ${Object.keys(VARIABLE_MIGRATION_MAP).length}`);
    console.log(`- Value replacements: ${Object.keys(VALUE_REPLACEMENTS).length}`);
    console.log('- Run without --dry-run to execute migration');
  }
  
  return { files: totalFiles, changes: totalChanges, changeLogs: allChangeLogs };
}

// Export for testing
module.exports = { migrateFile, migrateAllFiles, VARIABLE_MIGRATION_MAP, VALUE_REPLACEMENTS };

// Run if called directly
if (require.main === module) {
  const dryRun = process.argv.includes('--dry-run') || process.argv.includes('-d');
  
  console.log(`🚀 Starting semantic token migration${dryRun ? ' (dry run)' : ''}...`);
  console.log(`📋 Processing ${Object.keys(VARIABLE_MIGRATION_MAP).length} variable mappings`);
  
  migrateAllFiles(dryRun);
}