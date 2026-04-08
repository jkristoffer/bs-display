// Day 17 Task 1: CSS Bundle Size Validation
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class CSSBundleValidator {
  constructor() {
    this.results = {
      bundleAnalysis: {},
      comparison: {},
      targets: {
        maxSizeKB: 98,
        reductionTarget: 60 // percentage
      },
      validation: {
        passed: false,
        issues: []
      }
    };
  }

  async validateCSSBundle() {
    console.log('📦 Starting CSS Bundle Size Validation...\n');
    
    await this.analyzeBundleSize();
    await this.compareWithTargets();
    await this.validateFileStructure();
    await this.generateValidationReport();
  }

  async analyzeBundleSize() {
    console.log('📊 Analyzing current CSS bundle...');
    
    // Check if build exists
    const buildDir = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(buildDir)) {
      console.log('⚠️  Build directory not found, running build...');
      try {
        execSync('npm run build:fast', { stdio: 'inherit' });
        console.log('✅ Build completed');
      } catch (error) {
        console.error('❌ Build failed:', error.message);
        this.results.validation.issues.push('Build failed');
        return;
      }
    }

    // Find all CSS files
    const cssFiles = this.findFiles(buildDir, '.css');
    let totalCSSSize = 0;
    const fileAnalysis = [];

    cssFiles.forEach(file => {
      const stats = fs.statSync(file);
      const size = stats.size;
      totalCSSSize += size;
      
      fileAnalysis.push({
        file: path.relative(buildDir, file),
        sizeBytes: size,
        sizeKB: (size / 1024).toFixed(2)
      });
    });

    this.results.bundleAnalysis = {
      totalFiles: cssFiles.length,
      totalSizeBytes: totalCSSSize,
      totalSizeKB: (totalCSSSize / 1024).toFixed(2),
      files: fileAnalysis,
      timestamp: new Date().toISOString()
    };

    console.log(`📦 Found ${cssFiles.length} CSS files`);
    console.log(`📊 Total bundle size: ${(totalCSSSize / 1024).toFixed(2)}KB`);

    // Log individual files
    fileAnalysis.forEach(file => {
      console.log(`   ${file.file}: ${file.sizeKB}KB`);
    });
  }

  async compareWithTargets() {
    console.log('\n🎯 Comparing with targets...');
    
    const currentSizeKB = parseFloat(this.results.bundleAnalysis.totalSizeKB);
    const targetSizeKB = this.results.targets.maxSizeKB;
    
    // Calculate if we met the reduction target
    // Assuming baseline was ~245KB from project documentation
    const baselineSizeKB = 245;
    const actualReduction = ((baselineSizeKB - currentSizeKB) / baselineSizeKB) * 100;
    
    this.results.comparison = {
      currentSizeKB: currentSizeKB,
      targetSizeKB: targetSizeKB,
      baselineSizeKB: baselineSizeKB,
      actualReduction: actualReduction.toFixed(1),
      targetReduction: this.results.targets.reductionTarget,
      sizeTargetMet: currentSizeKB <= targetSizeKB,
      reductionTargetMet: actualReduction >= this.results.targets.reductionTarget,
      overallTargetMet: currentSizeKB <= targetSizeKB && actualReduction >= this.results.targets.reductionTarget
    };

    console.log(`📊 Current size: ${currentSizeKB}KB`);
    console.log(`🎯 Target size: ≤${targetSizeKB}KB`);
    console.log(`📈 Reduction achieved: ${actualReduction.toFixed(1)}%`);
    console.log(`🎯 Reduction target: ≥${this.results.targets.reductionTarget}%`);
    
    if (this.results.comparison.sizeTargetMet) {
      console.log('✅ Size target: ACHIEVED');
    } else {
      console.log('❌ Size target: NOT MET');
      this.results.validation.issues.push(`Bundle size ${currentSizeKB}KB exceeds target ${targetSizeKB}KB`);
    }
    
    if (this.results.comparison.reductionTargetMet) {
      console.log('✅ Reduction target: ACHIEVED');
    } else {
      console.log('❌ Reduction target: NOT MET');
      this.results.validation.issues.push(`Reduction ${actualReduction.toFixed(1)}% below target ${this.results.targets.reductionTarget}%`);
    }
  }

  async validateFileStructure() {
    console.log('\n🔍 Validating CSS file structure...');
    
    const expectedFiles = [
      'main',  // Main application CSS
      'components',  // Component styles
    ];
    
    const fileStructure = {
      expectedFiles: expectedFiles,
      foundFiles: [],
      missingFiles: [],
      unexpectedFiles: []
    };

    this.results.bundleAnalysis.files.forEach(file => {
      const fileName = file.file.replace(/\.[^/.]+$/, ""); // Remove extension
      const baseName = fileName.split('-')[0]; // Get base name before hash
      
      if (expectedFiles.some(expected => baseName.includes(expected))) {
        fileStructure.foundFiles.push(file.file);
      } else {
        fileStructure.unexpectedFiles.push(file.file);
      }
    });

    expectedFiles.forEach(expected => {
      if (!fileStructure.foundFiles.some(found => found.includes(expected))) {
        fileStructure.missingFiles.push(expected);
      }
    });

    this.results.bundleAnalysis.fileStructure = fileStructure;

    console.log(`✅ Expected files found: ${fileStructure.foundFiles.length}`);
    fileStructure.foundFiles.forEach(file => console.log(`   ${file}`));
    
    if (fileStructure.missingFiles.length > 0) {
      console.log(`⚠️  Missing expected files: ${fileStructure.missingFiles.length}`);
      fileStructure.missingFiles.forEach(file => console.log(`   ${file}`));
    }
    
    if (fileStructure.unexpectedFiles.length > 0) {
      console.log(`ℹ️  Additional files: ${fileStructure.unexpectedFiles.length}`);
      fileStructure.unexpectedFiles.forEach(file => console.log(`   ${file}`));
    }
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

  async generateValidationReport() {
    console.log('\n📋 Generating validation report...');
    
    // Determine overall validation result
    this.results.validation.passed = this.results.validation.issues.length === 0;
    
    const report = {
      taskName: 'CSS Bundle Size Validation',
      timestamp: new Date().toISOString(),
      status: this.results.validation.passed ? 'PASSED' : 'FAILED',
      summary: {
        currentSize: `${this.results.bundleAnalysis.totalSizeKB}KB`,
        targetSize: `≤${this.results.targets.maxSizeKB}KB`,
        reductionAchieved: `${this.results.comparison.actualReduction}%`,
        reductionTarget: `≥${this.results.targets.reductionTarget}%`,
        sizeTargetMet: this.results.comparison.sizeTargetMet,
        reductionTargetMet: this.results.comparison.reductionTargetMet,
        overallSuccess: this.results.comparison.overallTargetMet
      },
      details: this.results,
      nextSteps: this.results.validation.passed ? [
        'Proceed to Task 2: CSS Module Integration Testing',
        'Continue with comprehensive validation suite'
      ] : [
        'Investigate bundle size issues',
        'Optimize CSS further before proceeding',
        'Review file structure and dependencies'
      ]
    };

    // Save detailed report
    const reportPath = path.join('tests/day-17-validation/reports', 'task1-css-bundle-validation.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Update checkpoint
    this.updateCheckpoint(report.status);

    console.log('📊 Validation Report Summary:');
    console.log('================================');
    console.log(`Status: ${report.status}`);
    console.log(`Bundle Size: ${report.summary.currentSize} (Target: ${report.summary.targetSize})`);
    console.log(`Reduction: ${report.summary.reductionAchieved} (Target: ${report.summary.reductionTarget})`);
    console.log(`Size Target: ${report.summary.sizeTargetMet ? 'MET' : 'NOT MET'}`);
    console.log(`Reduction Target: ${report.summary.reductionTargetMet ? 'MET' : 'NOT MET'}`);
    
    if (this.results.validation.issues.length > 0) {
      console.log('\n❌ Issues Found:');
      this.results.validation.issues.forEach(issue => console.log(`   • ${issue}`));
    }

    console.log(`\n📄 Detailed report saved: ${reportPath}`);
    
    return report.status === 'PASSED';
  }

  updateCheckpoint(status) {
    const checkpointPath = 'tests/day-17-validation/checkpoint.md';
    let checkpointContent = fs.readFileSync(checkpointPath, 'utf8');
    
    // Update task 1 status
    checkpointContent = checkpointContent.replace(
      '- [ ] Task 1: CSS Bundle Size Validation',
      `- [${status === 'PASSED' ? 'x' : '!'}] Task 1: CSS Bundle Size Validation (${status})`
    );
    
    fs.writeFileSync(checkpointPath, checkpointContent);
  }
}

// Execute validation
const validator = new CSSBundleValidator();
validator.validateCSSBundle().then(success => {
  if (success) {
    console.log('\n✅ Task 1 completed successfully. Ready for Task 2.');
  } else {
    console.log('\n❌ Task 1 failed. Review issues before proceeding.');
  }
});