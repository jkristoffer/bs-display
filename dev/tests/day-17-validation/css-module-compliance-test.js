// Day 17 CSS Module Compliance Testing
import fs from 'fs';
import path from 'path';

class CSSModuleComplianceTester {
  constructor() {
    this.results = {
      components: [],
      inlineStyles: [],
      globalStyles: [],
      compliance: {
        totalComponents: 0,
        compliantComponents: 0,
        totalInlineStyles: 0,
        moduleAdoption: 0
      }
    };
  }

  async runComplianceTests() {
    console.log('📋 Starting CSS Module Compliance Testing...\n');
    
    await this.scanComponents();
    await this.checkInlineStyles();
    await this.checkGlobalStyles();
    await this.calculateCompliance();
    await this.generateComplianceReport();
    
    return this.results.compliance.moduleAdoption >= 95; // 95% compliance target
  }

  async scanComponents() {
    console.log('🔍 Scanning React/Astro components...');
    
    const componentDirs = [
      'src/components',
      'src/layouts',
      'src/pages'
    ];

    for (const dir of componentDirs) {
      if (fs.existsSync(dir)) {
        await this.scanDirectory(dir);
      }
    }

    console.log(`Found ${this.results.components.length} components to analyze`);
  }

  async scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        await this.scanDirectory(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.astro') || item.endsWith('.jsx')) {
        await this.analyzeComponent(fullPath);
      }
    }
  }

  async analyzeComponent(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(process.cwd(), filePath);
    
    // Check for CSS module imports
    const cssModuleImports = content.match(/import\s+\w+\s+from\s+['"]\.[^'"]*\.module\.(css|scss)['"]/g) || [];
    
    // Check for inline styles
    const inlineStyles = content.match(/style\s*=\s*\{[^}]*\}/g) || [];
    
    // Check for className usage (indicates CSS module usage)
    const classNameUsage = content.match(/className\s*=\s*{[^}]*}/g) || [];
    
    // Check for global style imports
    const globalStyleImports = content.match(/import\s+['"]\.[^'"]*\.(css|scss)['"]/g) || [];
    
    const componentAnalysis = {
      file: relativePath,
      type: filePath.endsWith('.astro') ? 'astro' : 'react',
      cssModuleImports: cssModuleImports.length,
      inlineStyles: inlineStyles.length,
      classNameUsage: classNameUsage.length,
      globalStyleImports: globalStyleImports.length,
      compliant: cssModuleImports.length > 0 && inlineStyles.length === 0,
      issues: []
    };

    // Identify issues
    if (cssModuleImports.length === 0 && classNameUsage.length > 0) {
      componentAnalysis.issues.push('Uses className but no CSS module imports found');
    }
    
    if (inlineStyles.length > 0) {
      componentAnalysis.issues.push(`${inlineStyles.length} inline styles found`);
      
      // Track inline styles for detailed analysis
      inlineStyles.forEach((style, index) => {
        this.results.inlineStyles.push({
          file: relativePath,
          line: this.getLineNumber(content, style),
          style: style.substring(0, 100) + (style.length > 100 ? '...' : '')
        });
      });
    }
    
    if (globalStyleImports.length > 0) {
      componentAnalysis.issues.push(`${globalStyleImports.length} global style imports found`);
    }

    this.results.components.push(componentAnalysis);
    this.results.compliance.totalComponents++;
    
    if (componentAnalysis.compliant) {
      this.results.compliance.compliantComponents++;
    }
    
    this.results.compliance.totalInlineStyles += inlineStyles.length;
  }

  getLineNumber(content, searchString) {
    const lines = content.substring(0, content.indexOf(searchString)).split('\n');
    return lines.length;
  }

  async checkInlineStyles() {
    console.log('🎨 Analyzing inline styles...');
    
    const inlineStylesByFile = {};
    this.results.inlineStyles.forEach(style => {
      if (!inlineStylesByFile[style.file]) {
        inlineStylesByFile[style.file] = [];
      }
      inlineStylesByFile[style.file].push(style);
    });

    console.log(`Found ${this.results.inlineStyles.length} inline styles across ${Object.keys(inlineStylesByFile).length} files`);
    
    if (Object.keys(inlineStylesByFile).length > 0) {
      console.log('Files with most inline styles:');
      const sortedFiles = Object.entries(inlineStylesByFile)
        .sort(([,a], [,b]) => b.length - a.length)
        .slice(0, 5);
      
      sortedFiles.forEach(([file, styles]) => {
        console.log(`  ${file}: ${styles.length} inline styles`);
      });
    }
  }

  async checkGlobalStyles() {
    console.log('🌐 Checking for global style usage...');
    
    const globalStyleFiles = this.findFiles('src', '.scss').filter(file => 
      !file.includes('.module.') && !file.includes('node_modules')
    );

    for (const file of globalStyleFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = path.relative(process.cwd(), file);
      
      // Check if it's a token/variable file (acceptable global usage)
      const isTokenFile = file.includes('token') || file.includes('variable') || file.includes('_');
      
      this.results.globalStyles.push({
        file: relativePath,
        size: content.length,
        sizeKB: (content.length / 1024).toFixed(2),
        isTokenFile: isTokenFile,
        acceptable: isTokenFile
      });
    }

    const unacceptableGlobalStyles = this.results.globalStyles.filter(s => !s.acceptable);
    console.log(`Found ${globalStyleFiles.length} global SCSS files (${unacceptableGlobalStyles.length} non-token files)`);
  }

  findFiles(dir, extension) {
    let files = [];
    
    if (!fs.existsSync(dir)) return files;
    
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files = files.concat(this.findFiles(fullPath, extension));
      } else if (item.endsWith(extension)) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  async calculateCompliance() {
    console.log('📊 Calculating compliance metrics...');
    
    this.results.compliance.moduleAdoption = this.results.compliance.totalComponents > 0 
      ? Math.round((this.results.compliance.compliantComponents / this.results.compliance.totalComponents) * 100)
      : 0;

    const metrics = this.results.compliance;
    console.log(`Module Adoption: ${metrics.moduleAdoption}% (${metrics.compliantComponents}/${metrics.totalComponents})`);
    console.log(`Inline Styles: ${metrics.totalInlineStyles} found`);
    console.log(`Global Styles: ${this.results.globalStyles.length} files`);
  }

  async generateComplianceReport() {
    console.log('\n📋 Generating compliance report...');
    
    const topIssues = this.results.components
      .filter(c => c.issues.length > 0)
      .sort((a, b) => b.issues.length - a.issues.length)
      .slice(0, 10);

    const report = {
      testName: 'CSS Module Compliance Testing',
      timestamp: new Date().toISOString(),
      summary: {
        totalComponents: this.results.compliance.totalComponents,
        compliantComponents: this.results.compliance.compliantComponents,
        moduleAdoption: `${this.results.compliance.moduleAdoption}%`,
        inlineStyles: this.results.compliance.totalInlineStyles,
        globalStyleFiles: this.results.globalStyles.length,
        complianceGrade: this.getComplianceGrade(this.results.compliance.moduleAdoption)
      },
      details: {
        componentAnalysis: this.results.components,
        inlineStyleDetails: this.results.inlineStyles.slice(0, 20), // First 20 for brevity
        globalStyleFiles: this.results.globalStyles,
        topIssues: topIssues
      },
      recommendations: this.generateRecommendations()
    };

    // Save detailed report
    const reportPath = path.join('tests/day-17-validation/reports', 'css-module-compliance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Print summary
    console.log('📊 CSS Module Compliance Summary:');
    console.log('===================================');
    console.log(`Module Adoption: ${report.summary.moduleAdoption} (Grade: ${report.summary.complianceGrade})`);
    console.log(`Compliant Components: ${report.summary.compliantComponents}/${report.summary.totalComponents}`);
    console.log(`Inline Styles: ${report.summary.inlineStyles} found`);
    console.log(`Global Style Files: ${report.summary.globalStyleFiles} files`);
    
    if (topIssues.length > 0) {
      console.log('\n⚠️ Components with Most Issues:');
      topIssues.slice(0, 5).forEach(component => {
        console.log(`  ${component.file}: ${component.issues.length} issues`);
        component.issues.forEach(issue => console.log(`    - ${issue}`));
      });
    }

    if (this.results.compliance.moduleAdoption >= 95) {
      console.log('\n✅ CSS Module compliance target met (≥95%)');
    } else {
      console.log('\n❌ CSS Module compliance below target (<95%)');
    }

    console.log(`\n📄 Detailed report saved: ${reportPath}`);
    
    return report;
  }

  getComplianceGrade(percentage) {
    if (percentage >= 95) return 'A';
    if (percentage >= 85) return 'B';
    if (percentage >= 75) return 'C';
    if (percentage >= 65) return 'D';
    return 'F';
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.results.compliance.moduleAdoption < 95) {
      recommendations.push('Migrate remaining components to CSS modules');
    }
    
    if (this.results.compliance.totalInlineStyles > 0) {
      recommendations.push(`Eliminate ${this.results.compliance.totalInlineStyles} inline styles by moving to CSS modules`);
    }
    
    const unacceptableGlobalStyles = this.results.globalStyles.filter(s => !s.acceptable);
    if (unacceptableGlobalStyles.length > 0) {
      recommendations.push(`Convert ${unacceptableGlobalStyles.length} global SCSS files to CSS modules`);
    }
    
    if (this.results.compliance.moduleAdoption >= 95) {
      recommendations.push('Excellent CSS module adoption - maintain current standards');
    }
    
    return recommendations;
  }
}

// Execute compliance testing
const tester = new CSSModuleComplianceTester();
tester.runComplianceTests().then(success => {
  if (success) {
    console.log('\n✅ CSS Module compliance testing passed');
  } else {
    console.log('\n⚠️ CSS Module compliance below target - improvements needed');
  }
});