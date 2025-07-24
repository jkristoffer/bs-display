const fs = require('fs');
const path = require('path');

function analyzeVariableUsage() {
  const usageFile = 'reports/phase-2/all-variable-usage.txt';
  
  if (!fs.existsSync(usageFile)) {
    console.error('Usage file not found. Run grep command first.');
    return;
  }
  
  const usageData = fs.readFileSync(usageFile, 'utf8').split('\n');
  const variableMap = {};
  
  usageData.forEach(line => {
    if (line.trim()) {
      const parts = line.split(':');
      if (parts.length >= 3) {
        const file = parts[0];
        const lineNum = parts[1];
        const content = parts.slice(2).join(':');
        
        // Extract CSS custom properties with more comprehensive pattern
        const variables = content.match(/--[a-z][a-z0-9-]*[a-z0-9]/g) || [];
        
        variables.forEach(variable => {
          if (!variableMap[variable]) {
            variableMap[variable] = { 
              count: 0, 
              files: new Set(), 
              locations: [] 
            };
          }
          variableMap[variable].count++;
          variableMap[variable].files.add(file);
          variableMap[variable].locations.push(`${file}:${lineNum}`);
        });
      }
    }
  });
  
  // Generate detailed report
  const report = Object.entries(variableMap)
    .sort(([,a], [,b]) => b.count - a.count)
    .map(([variable, data]) => ({
      variable,
      usage_count: data.count,
      file_count: data.files.size,
      files: Array.from(data.files),
      sample_locations: data.locations.slice(0, 5)
    }));
    
  fs.writeFileSync('reports/phase-2/detailed-usage-analysis.json', JSON.stringify(report, null, 2));
  
  console.log(`Analysis complete: ${Object.keys(variableMap).length} variables analyzed`);
  console.log(`Total usage instances: ${Object.values(variableMap).reduce((sum, v) => sum + v.count, 0)}`);
  
  // Generate summary report
  const summary = {
    total_variables: Object.keys(variableMap).length,
    total_usage_instances: Object.values(variableMap).reduce((sum, v) => sum + v.count, 0),
    high_usage_variables: report.filter(v => v.usage_count > 50).length,
    medium_usage_variables: report.filter(v => v.usage_count >= 10 && v.usage_count <= 50).length,
    low_usage_variables: report.filter(v => v.usage_count < 10).length,
    top_10_variables: report.slice(0, 10).map(v => ({ 
      variable: v.variable, 
      count: v.usage_count, 
      files: v.file_count 
    }))
  };
  
  fs.writeFileSync('reports/phase-2/usage-analysis-summary.json', JSON.stringify(summary, null, 2));
  
  return summary;
}

// Run if called directly
if (require.main === module) {
  analyzeVariableUsage();
}

module.exports = analyzeVariableUsage;