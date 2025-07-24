const fs = require('fs');

function validateSpacing() {
  const variablesContent = fs.readFileSync('src/styles/variables.scss', 'utf8');
  
  // Extract spacing variables with their values
  const spacingMatches = variablesContent.match(/--spacing-[^:]+:\s*([^;]+);/g) || [];
  const spacingAnalysis = {
    total_spacing: spacingMatches.length,
    spacing_values: {},
    system_compliance: {
      follows_8px_grid: [],
      violates_8px_grid: [],
      rem_based: [],
      px_based: []
    },
    duplicates: [],
    recommendations: []
  };
  
  spacingMatches.forEach(match => {
    const [variable, value] = match.split(':').map(s => s.trim().replace(';', ''));
    const cleanValue = value.replace(/\s/g, '');
    
    spacingAnalysis.spacing_values[variable] = cleanValue;
    
    // Check for 8px grid compliance
    if (cleanValue.includes('rem')) {
      spacingAnalysis.system_compliance.rem_based.push({variable, value: cleanValue});
      
      // Convert rem to px (assuming 1rem = 16px)
      const remValue = parseFloat(cleanValue.replace('rem', ''));
      const pxValue = remValue * 16;
      
      if (pxValue % 8 === 0 || pxValue === 0) {
        spacingAnalysis.system_compliance.follows_8px_grid.push({
          variable, 
          value: cleanValue, 
          px_equivalent: `${pxValue}px`
        });
      } else {
        spacingAnalysis.system_compliance.violates_8px_grid.push({
          variable, 
          value: cleanValue, 
          px_equivalent: `${pxValue}px`,
          nearest_8px: `${Math.round(pxValue / 8) * 8}px`
        });
      }
    } else if (cleanValue.includes('px')) {
      spacingAnalysis.system_compliance.px_based.push({variable, value: cleanValue});
      
      const pxValue = parseFloat(cleanValue.replace('px', ''));
      if (pxValue % 8 === 0 || pxValue === 0) {
        spacingAnalysis.system_compliance.follows_8px_grid.push({
          variable, 
          value: cleanValue, 
          px_equivalent: cleanValue
        });
      } else {
        spacingAnalysis.system_compliance.violates_8px_grid.push({
          variable, 
          value: cleanValue, 
          px_equivalent: cleanValue,
          nearest_8px: `${Math.round(pxValue / 8) * 8}px`
        });
      }
    }
    
    // Check for duplicates
    const existing = Object.entries(spacingAnalysis.spacing_values)
      .find(([k, v]) => v === cleanValue && k !== variable);
    
    if (existing) {
      spacingAnalysis.duplicates.push({
        value: cleanValue,
        variables: [existing[0], variable]
      });
    }
  });
  
  // Generate recommendations
  const compliance_rate = (spacingAnalysis.system_compliance.follows_8px_grid.length / spacingMatches.length) * 100;
  
  if (compliance_rate < 80) {
    spacingAnalysis.recommendations.push({
      type: 'system_consistency',
      message: `Only ${compliance_rate.toFixed(1)}% of spacing follows 8px grid. Consider standardizing.`,
      action: 'Update non-compliant values to nearest 8px increment'
    });
  }
  
  if (spacingAnalysis.duplicates.length > 0) {
    spacingAnalysis.recommendations.push({
      type: 'duplicate_consolidation',
      message: `${spacingAnalysis.duplicates.length} duplicate spacing values found`,
      action: 'Consolidate duplicates to single variables'
    });
  }
  
  const remBasedCount = spacingAnalysis.system_compliance.rem_based.length;
  const pxBasedCount = spacingAnalysis.system_compliance.px_based.length;
  
  if (remBasedCount > 0 && pxBasedCount > 0) {
    spacingAnalysis.recommendations.push({
      type: 'unit_consistency',
      message: `Mixed units: ${remBasedCount} rem-based, ${pxBasedCount} px-based`,
      action: 'Standardize on rem units for better accessibility'
    });
  }
  
  fs.writeFileSync('reports/phase-2/spacing-validation.json', JSON.stringify(spacingAnalysis, null, 2));
  
  console.log('Spacing validation complete:');
  console.log(`- Total spacing variables: ${spacingAnalysis.total_spacing}`);
  console.log(`- 8px grid compliant: ${spacingAnalysis.system_compliance.follows_8px_grid.length}`);
  console.log(`- 8px grid violations: ${spacingAnalysis.system_compliance.violates_8px_grid.length}`);
  console.log(`- Duplicate values: ${spacingAnalysis.duplicates.length}`);
  console.log(`- Recommendations: ${spacingAnalysis.recommendations.length}`);
  
  return spacingAnalysis;
}

// Run if called directly
if (require.main === module) {
  validateSpacing();
}

module.exports = validateSpacing;