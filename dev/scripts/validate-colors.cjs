const fs = require('fs');

function validateColors() {
  const variablesContent = fs.readFileSync('src/styles/variables.scss', 'utf8');
  
  // Extract color variables with their values
  const colorMatches = variablesContent.match(/--color-[^:]+:\s*([^;]+);/g) || [];
  const colorAnalysis = {
    total_colors: colorMatches.length,
    color_values: {},
    duplicates: [],
    primary_colors: {},
    accessibility_warnings: []
  };
  
  colorMatches.forEach(match => {
    const [variable, value] = match.split(':').map(s => s.trim().replace(';', ''));
    const cleanValue = value.replace(/\s/g, '');
    
    // Store color mapping
    colorAnalysis.color_values[variable] = cleanValue;
    
    // Check for primary brand colors
    if (variable.includes('primary') || variable.includes('accent-primary')) {
      colorAnalysis.primary_colors[variable] = cleanValue;
    }
    
    // Check for hex color duplicates
    if (cleanValue.match(/#[0-9a-fA-F]{3,6}/)) {
      const existing = Object.entries(colorAnalysis.color_values)
        .find(([k, v]) => v === cleanValue && k !== variable);
      
      if (existing) {
        colorAnalysis.duplicates.push({
          value: cleanValue,
          variables: [existing[0], variable]
        });
      }
    }
  });
  
  // Validate primary color consistency
  const primaryColors = Object.entries(colorAnalysis.primary_colors);
  const primaryValues = [...new Set(Object.values(colorAnalysis.primary_colors))];
  
  if (primaryValues.length > 1) {
    colorAnalysis.accessibility_warnings.push({
      type: 'brand_inconsistency',
      message: 'Multiple primary color values found',
      colors: colorAnalysis.primary_colors
    });
  }
  
  // Validate hex color format
  Object.entries(colorAnalysis.color_values).forEach(([variable, value]) => {
    if (value.startsWith('#')) {
      const hexPattern = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
      if (!hexPattern.test(value)) {
        colorAnalysis.accessibility_warnings.push({
          type: 'invalid_hex',
          variable: variable,
          value: value,
          message: 'Invalid hex color format'
        });
      }
    }
  });
  
  // Check for contrast issues (simplified)
  const textColors = Object.entries(colorAnalysis.color_values)
    .filter(([k, v]) => k.includes('text'));
  const backgroundColors = Object.entries(colorAnalysis.color_values)
    .filter(([k, v]) => k.includes('background') || k.includes('surface'));
  
  if (textColors.length && backgroundColors.length) {
    colorAnalysis.contrast_combinations = {
      text_colors: textColors.length,
      background_colors: backgroundColors.length,
      note: 'Manual contrast validation required for accessibility compliance'
    };
  }
  
  fs.writeFileSync('reports/phase-2/color-validation.json', JSON.stringify(colorAnalysis, null, 2));
  
  console.log('Color validation complete:');
  console.log(`- Total color variables: ${colorAnalysis.total_colors}`);
  console.log(`- Duplicate color groups: ${colorAnalysis.duplicates.length}`);
  console.log(`- Primary colors found: ${Object.keys(colorAnalysis.primary_colors).length}`);
  console.log(`- Accessibility warnings: ${colorAnalysis.accessibility_warnings.length}`);
  
  return colorAnalysis;
}

// Run if called directly
if (require.main === module) {
  validateColors();
}

module.exports = validateColors;