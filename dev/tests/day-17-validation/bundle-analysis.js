// CSS Bundle Analysis Tool
import fs from 'fs';
import path from 'path';

class BundleAnalyzer {
  constructor() {
    this.buildDir = path.join(process.cwd(), 'dist');
    this.analysis = {
      cssFiles: [],
      totalSize: 0,
      largestFiles: [],
      duplicateContent: {},
      issues: []
    };
  }

  async analyzeBundleIssues() {
    console.log('🔍 Analyzing CSS bundle size discrepancy...\n');
    
    await this.scanCSSFiles();
    await this.identifyLargestFiles();
    await this.checkForDuplicates();
    await this.analyzePageSplitting();
    await this.generateAnalysisReport();
  }

  async scanCSSFiles() {
    console.log('📊 Scanning CSS files...');
    
    const cssFiles = this.findFiles(this.buildDir, '.css');
    let totalSize = 0;

    for (const file of cssFiles) {
      const stats = fs.statSync(file);
      const relativePath = path.relative(this.buildDir, file);
      const content = fs.readFileSync(file, 'utf8');
      
      const fileInfo = {
        path: relativePath,
        size: stats.size,
        sizeKB: (stats.size / 1024).toFixed(2),
        content: content,
        lines: content.split('\n').length,
        compressed: file.includes('.min.css')
      };
      
      this.analysis.cssFiles.push(fileInfo);
      totalSize += stats.size;
    }

    this.analysis.totalSize = totalSize;
    console.log(`Found ${cssFiles.length} CSS files totaling ${(totalSize / 1024).toFixed(2)}KB`);
  }

  async identifyLargestFiles() {
    console.log('📈 Identifying largest files...');
    
    // Sort by size and get top 10
    const sortedFiles = [...this.analysis.cssFiles].sort((a, b) => b.size - a.size);
    this.analysis.largestFiles = sortedFiles.slice(0, 10);
    
    console.log('Top 10 largest CSS files:');
    this.analysis.largestFiles.forEach((file, index) => {
      console.log(`${index + 1}. ${file.path}: ${file.sizeKB}KB`);
    });
  }

  async checkForDuplicates() {
    console.log('🔍 Checking for duplicate content...');
    
    const contentHashes = {};
    let duplicateSize = 0;
    
    for (const file of this.analysis.cssFiles) {
      // Create a simple hash of the content
      const contentHash = this.simpleHash(file.content);
      
      if (contentHashes[contentHash]) {
        contentHashes[contentHash].push(file);
        duplicateSize += file.size;
      } else {
        contentHashes[contentHash] = [file];
      }
    }

    // Find duplicates
    const duplicates = Object.values(contentHashes).filter(group => group.length > 1);
    
    if (duplicates.length > 0) {
      console.log(`Found ${duplicates.length} sets of duplicate content:`);
      duplicates.forEach((group, index) => {
        const totalDupeSize = group.reduce((sum, file) => sum + file.size, 0);
        console.log(`Duplicate set ${index + 1}: ${group.length} files, ${(totalDupeSize / 1024).toFixed(2)}KB total`);
        group.forEach(file => console.log(`  - ${file.path}`));
      });
      
      this.analysis.duplicateContent = {
        sets: duplicates.length,
        totalWastedSize: duplicateSize,
        details: duplicates
      };
    } else {
      console.log('No exact duplicate content found');
    }
  }

  async analyzePageSplitting() {
    console.log('📄 Analyzing page-specific CSS splitting...');
    
    // Group files by apparent page/route
    const pageGroups = {};
    
    for (const file of this.analysis.cssFiles) {
      let pageKey = 'shared';
      
      // Try to identify page-specific files
      if (file.path.includes('index.')) {
        pageKey = 'index-pages';
      } else if (file.path.includes('quiz.')) {
        pageKey = 'quiz';
      } else if (file.path.includes('analytics')) {
        pageKey = 'analytics';
      } else if (file.path.includes('smart-whiteboard')) {
        pageKey = 'buying-guide';
      } else if (file.path.includes('NavWrapper')) {
        pageKey = 'navigation';
      } else if (file.path.includes('journeys')) {
        pageKey = 'journeys';
      } else if (file.path.includes('products')) {
        pageKey = 'products';
      } else if (file.path.includes('overview')) {
        pageKey = 'overview';
      } else if (file.path.includes('realtime')) {
        pageKey = 'realtime';
      }
      
      if (!pageGroups[pageKey]) {
        pageGroups[pageKey] = [];
      }
      pageGroups[pageKey].push(file);
    }

    console.log('CSS files grouped by apparent usage:');
    for (const [group, files] of Object.entries(pageGroups)) {
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      console.log(`${group}: ${files.length} files, ${(totalSize / 1024).toFixed(2)}KB`);
    }

    // Check if this splitting is causing inefficiency
    const indexPages = pageGroups['index-pages'] || [];
    if (indexPages.length > 5) {
      this.analysis.issues.push({
        type: 'excessive-page-splitting',
        description: `${indexPages.length} separate CSS files for index pages may indicate over-splitting`,
        impact: 'Increases total bundle size due to duplicate base styles',
        recommendation: 'Consider consolidating common styles into shared bundles'
      });
    }

    this.analysis.pageGroups = pageGroups;
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
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

  async generateAnalysisReport() {
    console.log('\n📋 Generating bundle analysis report...');
    
    // Calculate key metrics
    const avgFileSize = this.analysis.totalSize / this.analysis.cssFiles.length;
    const compressionRatio = this.analysis.cssFiles.filter(f => f.compressed).length / this.analysis.cssFiles.length;
    
    // Identify potential issues
    if (this.analysis.totalSize > 100 * 1024) { // > 100KB
      this.analysis.issues.push({
        type: 'bundle-too-large',
        description: `Total bundle size ${(this.analysis.totalSize / 1024).toFixed(2)}KB exceeds 98KB target`,
        impact: 'Performance degradation, slower page loads',
        recommendation: 'Implement PurgeCSS, consolidate styles, remove unused CSS'
      });
    }

    if (this.analysis.cssFiles.length > 10) {
      this.analysis.issues.push({
        type: 'too-many-files',
        description: `${this.analysis.cssFiles.length} separate CSS files may cause HTTP overhead`,
        impact: 'Multiple network requests slow down page loading',
        recommendation: 'Consolidate files, implement proper chunking strategy'
      });
    }

    if (avgFileSize < 5 * 1024) { // < 5KB average
      this.analysis.issues.push({
        type: 'file-fragmentation',
        description: `Average file size ${(avgFileSize / 1024).toFixed(2)}KB suggests over-fragmentation`,
        impact: 'Network overhead from many small requests',
        recommendation: 'Bundle small files together'
      });
    }

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFiles: this.analysis.cssFiles.length,
        totalSize: `${(this.analysis.totalSize / 1024).toFixed(2)}KB`,
        targetSize: '98KB',
        overTarget: `${(((this.analysis.totalSize / 1024) / 98 - 1) * 100).toFixed(1)}%`,
        avgFileSize: `${(avgFileSize / 1024).toFixed(2)}KB`,
        compressionRatio: `${(compressionRatio * 100).toFixed(1)}%`
      },
      largestFiles: this.analysis.largestFiles.slice(0, 5).map(f => ({
        file: f.path,
        size: f.sizeKB + 'KB'
      })),
      issues: this.analysis.issues,
      pageGroups: Object.entries(this.analysis.pageGroups || {}).map(([group, files]) => ({
        group,
        fileCount: files.length,
        totalSize: `${(files.reduce((sum, f) => sum + f.size, 0) / 1024).toFixed(2)}KB`
      })),
      duplicateContent: this.analysis.duplicateContent,
      recommendations: [
        'Implement PurgeCSS to remove unused styles',
        'Consolidate page-specific CSS files',
        'Enable proper CSS minification and compression',
        'Review build configuration for optimal chunking',
        'Consider critical CSS extraction for above-fold content'
      ]
    };

    // Save report
    const reportPath = path.join('tests/day-17-validation/reports', 'bundle-analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('📊 Bundle Analysis Summary:');
    console.log('===========================');
    console.log(`Total Size: ${report.summary.totalSize} (Target: 98KB)`);
    console.log(`Over Target: ${report.summary.overTarget}%`);
    console.log(`File Count: ${report.summary.totalFiles}`);
    console.log(`Average Size: ${report.summary.avgFileSize}`);
    console.log(`Compression: ${report.summary.compressionRatio} minified`);
    
    if (this.analysis.issues.length > 0) {
      console.log('\n❌ Issues Found:');
      this.analysis.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.type}: ${issue.description}`);
        console.log(`   Impact: ${issue.impact}`);
        console.log(`   Fix: ${issue.recommendation}\n`);
      });
    }

    console.log(`\n📄 Detailed report saved: ${reportPath}`);
    
    return report;
  }
}

// Execute analysis
const analyzer = new BundleAnalyzer();
analyzer.analyzeBundleIssues().then(() => {
  console.log('\n✅ Bundle analysis completed');
});