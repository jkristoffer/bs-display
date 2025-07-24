const fs = require('fs');

function identifyDuplicates() {
  const variablesFile = 'src/styles/variables.scss';
  const content = fs.readFileSync(variablesFile, 'utf8');
  
  // Extract color variables with their values
  const colorMatches = content.match(/--color-[^:]+:\s*([^;]+);/g) || [];
  const colorValues = {};
  const duplicateColors = [];
  
  colorMatches.forEach(match => {
    const [variable, value] = match.split(':').map(s => s.trim().replace(';', ''));
    const cleanValue = value.replace(/\s/g, '');
    
    if (colorValues[cleanValue]) {
      duplicateColors.push({
        value: cleanValue,
        variables: [colorValues[cleanValue], variable]
      });
    } else {
      colorValues[cleanValue] = variable;
    }
  });
  
  // Extract spacing variables
  const spacingMatches = content.match(/--spacing-[^:]+:\s*([^;]+);/g) || [];
  const spacingValues = {};
  const duplicateSpacing = [];
  
  spacingMatches.forEach(match => {
    const [variable, value] = match.split(':').map(s => s.trim().replace(';', ''));
    const cleanValue = value.replace(/\s/g, '');
    
    if (spacingValues[cleanValue]) {
      duplicateSpacing.push({
        value: cleanValue,
        variables: [spacingValues[cleanValue], variable]
      });
    } else {
      spacingValues[cleanValue] = variable;
    }
  });
  
  // Find variables referencing same color values
  const colorDuplicatesReport = [];
  const valueGroups = {};
  
  Object.entries(colorValues).forEach(([value, variable]) => {
    // Check for hex color values
    if (value.match(/#[0-9a-fA-F]{3,6}/)) {
      if (valueGroups[value]) {
        valueGroups[value].push(variable);
      } else {
        valueGroups[value] = [variable];
      }
    }
  });
  
  Object.entries(valueGroups).forEach(([value, variables]) => {
    if (variables.length > 1) {
      colorDuplicatesReport.push({
        color_value: value,
        duplicate_variables: variables,
        consolidation_opportunity: `${variables.length} variables using same color`
      });
    }
  });
  
  const report = {
    analysis_date: new Date().toISOString(),
    color_duplicates: colorDuplicatesReport,
    spacing_duplicates: duplicateSpacing,
    summary: {
      total_color_variables: colorMatches.length,
      duplicate_color_groups: colorDuplicatesReport.length,
      total_spacing_variables: spacingMatches.length,
      duplicate_spacing_groups: duplicateSpacing.length
    }
  };
  
  fs.writeFileSync('reports/phase-2/duplicate-variables-analysis.json', JSON.stringify(report, null, 2));
  
  console.log(`Duplicate analysis complete:`);
  console.log(`- Color variables: ${colorMatches.length}`);
  console.log(`- Duplicate color groups: ${colorDuplicatesReport.length}`);
  console.log(`- Spacing variables: ${spacingMatches.length}`);
  console.log(`- Duplicate spacing groups: ${duplicateSpacing.length}`);
  
  return report;
}

// Run if called directly
if (require.main === module) {
  identifyDuplicates();
}

module.exports = identifyDuplicates;