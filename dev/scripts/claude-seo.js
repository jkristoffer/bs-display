#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import SEOAgent from './seo-agent.js';
import SEOOptimizer from './seo-optimizer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ClaudeSEOInterface {
  constructor() {
    this.seoAgent = new SEOAgent();
    this.seoOptimizer = new SEOOptimizer();
    this.projectRoot = path.join(__dirname, '..');
    this.commands = {
      'seo-review': this.reviewPR.bind(this),
      'seo-quick-check': this.quickCheck.bind(this),
      'seo-optimize': this.optimizeContent.bind(this),
      'seo-auto-optimize': this.autoOptimize.bind(this),
      'seo-apply-fixes': this.applyFixes.bind(this),
      'seo-preview-changes': this.previewChanges.bind(this),
      'seo-rollback': this.rollbackChanges.bind(this),
      'seo-report': this.generateReport.bind(this),
      'seo-batch': this.batchAnalysis.bind(this),
      'seo-compare': this.compareContent.bind(this),
      'seo-monitor': this.monitorPerformance.bind(this)
    };
  }

  // Main command router
  async execute(command, args) {
    if (!this.commands[command]) {
      this.showHelp();
      return;
    }

    try {
      await this.commands[command](args);
    } catch (error) {
      console.error(`❌ Error executing ${command}:`, error.message);
      process.exit(1);
    }
  }

  // Review PR with comprehensive SEO analysis
  async reviewPR(args) {
    const prNumber = args.pr || args['pr-number'];
    const file = args.file;
    const autoComment = args['auto-comment'] !== false;

    console.log('🔍 Claude SEO Expert Agent - PR Review');
    console.log('=====================================\n');

    if (prNumber) {
      await this.reviewPRByNumber(prNumber, autoComment);
    } else if (file) {
      await this.reviewSingleFile(file, autoComment);
    } else {
      // Auto-detect latest blog posts
      await this.reviewLatestContent();
    }
  }

  async reviewPRByNumber(prNumber, autoComment = true) {
    console.log(`📋 Analyzing PR #${prNumber}...\n`);

    try {
      // Store current branch for restoration later
      const currentBranch = this.getCurrentBranch();
      console.log(`💾 Current branch: ${currentBranch}`);
      
      // Checkout PR branch automatically
      console.log(`🔄 Checking out PR #${prNumber}...`);
      this.checkoutPR(prNumber);
      console.log(`✅ Successfully checked out PR branch\n`);

      // Get PR files using GitHub CLI
      const prFiles = this.getPRFiles(prNumber);
      const blogFiles = prFiles.filter(file => 
        file.includes('src/content/blog/') && file.endsWith('.md')
      );

      if (blogFiles.length === 0) {
        console.log('❌ No blog content found in this PR');
        // Restore original branch
        console.log(`🔙 Restoring branch: ${currentBranch}`);
        this.checkoutBranch(currentBranch);
        return;
      }

      let overallScore = 0;
      const analyses = [];

      for (const file of blogFiles) {
        console.log(`\n🔍 Analyzing: ${path.basename(file)}`);
        console.log('─'.repeat(50));

        // Convert relative path to absolute path from repository root
        const fullPath = path.resolve(path.join(this.projectRoot, '..'), file);
        const analysis = await this.seoAgent.analyzeBlogPost(fullPath);
        analyses.push(analysis);
        overallScore += analysis.overall;

        this.displayAnalysis(analysis);
      }

      // Calculate average score
      const avgScore = Math.round(overallScore / analyses.length);
      
      console.log('\n📊 PR SUMMARY');
      console.log('='.repeat(50));
      console.log(`📈 Average SEO Score: ${avgScore}/100 ${this.getScoreEmoji(avgScore)}`);
      console.log(`📄 Files Analyzed: ${analyses.length}`);
      console.log(`🎯 Recommendation: ${this.getPRRecommendation(avgScore)}\n`);

      // Auto-comment on PR if enabled
      if (autoComment) {
        await this.commentOnPR(prNumber, analyses, avgScore);
      }

      // Auto-approve if score is high enough
      if (avgScore >= 85) {
        console.log('🚀 Score exceeds auto-approval threshold (85)');
        console.log('💡 Consider auto-approving this PR for publication');
      }

      // Restore original branch
      console.log(`\n🔙 Restoring branch: ${currentBranch}`);
      this.checkoutBranch(currentBranch);
      console.log(`✅ Restored to ${currentBranch}`);

    } catch (error) {
      console.error('❌ Failed to analyze PR:', error.message);
      
      // Try to restore branch even on error
      try {
        const currentBranch = this.getCurrentBranch();
        if (currentBranch !== 'main') {
          console.log('🔙 Attempting to restore main branch due to error...');
          this.checkoutBranch('main');
        }
      } catch (restoreError) {
        console.error('⚠️ Could not restore branch:', restoreError.message);
      }
    }
  }

  async reviewSingleFile(filePath, autoComment = false) {
    const fullPath = path.resolve(filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ File not found: ${filePath}`);
      return;
    }

    console.log(`🔍 Analyzing: ${path.basename(fullPath)}\n`);
    
    const analysis = await this.seoAgent.analyzeBlogPost(fullPath);
    this.displayAnalysis(analysis);
    
    console.log('\n💡 OPTIMIZATION SUGGESTIONS');
    console.log('─'.repeat(30));
    this.displayOptimizationSuggestions(analysis);
  }

  async reviewLatestContent() {
    console.log('🔍 Auto-detecting latest blog content...\n');
    
    const blogDir = path.join(this.projectRoot, 'src/content/blog');
    const files = fs.readdirSync(blogDir)
      .filter(file => file.endsWith('.md'))
      .map(file => ({
        name: file,
        path: path.join(blogDir, file),
        mtime: fs.statSync(path.join(blogDir, file)).mtime
      }))
      .sort((a, b) => b.mtime - a.mtime)
      .slice(0, 3); // Latest 3 files

    if (files.length === 0) {
      console.log('❌ No blog content found');
      return;
    }

    console.log(`📊 Analyzing ${files.length} most recent blog posts:\n`);

    for (const file of files) {
      console.log(`\n🔍 ${file.name}`);
      console.log('─'.repeat(50));
      
      const analysis = await this.seoAgent.analyzeBlogPost(file.path);
      this.displayAnalysis(analysis, true); // Compact view
    }
  }

  // Quick check for a single file
  async quickCheck(args) {
    const file = args.file || args._[0];
    
    if (!file) {
      console.error('❌ Please specify a file: claude seo-quick-check --file blog.md');
      return;
    }

    console.log('⚡ Claude SEO Quick Check');
    console.log('========================\n');

    const analysis = await this.seoAgent.analyzeBlogPost(file);
    
    // Display compact results
    console.log(`📄 File: ${path.basename(file)}`);
    console.log(`📈 SEO Score: ${analysis.overall}/100 ${this.getScoreEmoji(analysis.overall)}`);
    console.log(`🎯 Grade: ${this.seoAgent.getGrade(analysis.overall)}\n`);

    // Top 3 issues
    if (analysis.recommendations.length > 0) {
      console.log('🔥 TOP PRIORITIES:');
      analysis.recommendations.slice(0, 3).forEach((rec, i) => {
        console.log(`   ${i + 1}. ${rec}`);
      });
    }

    // Quick wins
    const quickWins = this.identifyQuickWins(analysis);
    if (quickWins.length > 0) {
      console.log('\n⚡ QUICK WINS:');
      quickWins.forEach(win => console.log(`   • ${win}`));
    }
  }

  // Content optimization suggestions
  async optimizeContent(args) {
    const file = args.file;
    const applyFixes = args.apply || args.fix;
    
    console.log('🎯 Claude SEO Content Optimizer');
    console.log('===============================\n');

    const analysis = await this.seoAgent.analyzeBlogPost(file);
    
    console.log(`📄 Optimizing: ${path.basename(file)}`);
    console.log(`📈 Current Score: ${analysis.overall}/100\n`);

    // Generate specific optimization recommendations
    const optimizations = this.generateOptimizations(analysis);
    
    console.log('🛠️ OPTIMIZATION PLAN:');
    console.log('─'.repeat(20));
    
    optimizations.forEach((opt, i) => {
      console.log(`\n${i + 1}. ${opt.category.toUpperCase()}`);
      console.log(`   Impact: ${opt.impact} | Difficulty: ${opt.difficulty}`);
      console.log(`   Issue: ${opt.issue}`);
      console.log(`   Fix: ${opt.solution}`);
      if (opt.example) {
        console.log(`   Example: ${opt.example}`);
      }
    });

    // Auto-apply fixes if requested
    if (applyFixes) {
      console.log('\n🔧 Applying automated fixes...');
      await this.applyAutomatedFixes(file, optimizations);
    } else {
      console.log('\n💡 Run with --apply to automatically implement fixes');
    }
  }

  // Auto-Optimization Commands
  async autoOptimize(args) {
    const prNumber = args.pr || args['pr-number'];
    const file = args.file;
    const aggressive = args.aggressive || false;
    const autoComment = args['auto-comment'] !== false;

    console.log('🚀 Claude SEO Auto-Optimizer');
    console.log('============================\n');

    if (prNumber) {
      await this.autoOptimizePR(prNumber, { aggressive, autoComment });
    } else if (file) {
      await this.autoOptimizeFile(file, { aggressive });
    } else {
      console.error('❌ Please specify --pr NUMBER or --file PATH');
    }
  }

  async autoOptimizePR(prNumber, options = {}) {
    console.log(`📋 Auto-optimizing PR #${prNumber}...\n`);

    try {
      // Store current branch for restoration later
      const currentBranch = this.getCurrentBranch();
      console.log(`💾 Current branch: ${currentBranch}`);
      
      // Checkout PR branch automatically
      console.log(`🔄 Checking out PR #${prNumber}...`);
      this.checkoutPR(prNumber);
      console.log(`✅ Successfully checked out PR branch\n`);

      // Get PR files
      const prFiles = this.getPRFiles(prNumber);
      const blogFiles = prFiles.filter(file => 
        file.includes('src/content/blog/') && file.endsWith('.md')
      );

      if (blogFiles.length === 0) {
        console.log('❌ No blog content found in this PR');
        console.log(`🔙 Restoring branch: ${currentBranch}`);
        this.checkoutBranch(currentBranch);
        return;
      }

      const results = [];
      let totalImprovements = 0;

      for (const file of blogFiles) {
        console.log(`\n🎯 Auto-optimizing: ${path.basename(file)}`);
        console.log('─'.repeat(50));

        const fullPath = path.resolve(path.join(this.projectRoot, '..'), file);
        const result = await this.seoOptimizer.optimizeContent(fullPath, {
          improveReadability: options.aggressive,
          addFAQ: options.aggressive
        });

        results.push({ file: path.basename(file), ...result });
        if (result.success && result.improvement) {
          totalImprovements += result.improvement;
        }

        console.log(`📊 Result: ${result.success ? '✅ Success' : '❌ Failed'}`);
        if (result.success && result.improvement) {
          console.log(`📈 Score: ${result.initialScore} → ${result.finalScore} (+${result.improvement})`);
        }
      }

      // Commit optimizations if any were successful
      const successfulOptimizations = results.filter(r => r.success && r.improvement > 0);
      
      if (successfulOptimizations.length > 0) {
        console.log('\n🔄 Committing SEO optimizations...');
        this.commitOptimizations(prNumber, successfulOptimizations, totalImprovements);
        
        if (options.autoComment) {
          console.log('\n💬 Adding optimization comment to PR...');
          await this.commentOptimizationResults(prNumber, results, totalImprovements);
        }
      }

      console.log('\n📊 AUTO-OPTIMIZATION SUMMARY');
      console.log('='.repeat(50));
      console.log(`📄 Files processed: ${results.length}`);
      console.log(`✅ Successfully optimized: ${successfulOptimizations.length}`);
      console.log(`📈 Total score improvement: +${totalImprovements} points`);

      // Restore original branch
      console.log(`\n🔙 Restoring branch: ${currentBranch}`);
      this.checkoutBranch(currentBranch);
      console.log(`✅ Restored to ${currentBranch}`);

    } catch (error) {
      console.error('❌ Auto-optimization failed:', error.message);
      
      // Try to restore branch even on error
      try {
        const currentBranch = this.getCurrentBranch();
        if (currentBranch !== 'main') {
          console.log('🔙 Attempting to restore main branch due to error...');
          this.checkoutBranch('main');
        }
      } catch (restoreError) {
        console.error('⚠️ Could not restore branch:', restoreError.message);
      }
    }
  }

  async autoOptimizeFile(filePath, options = {}) {
    const fullPath = path.resolve(filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ File not found: ${filePath}`);
      return;
    }

    const result = await this.seoOptimizer.optimizeContent(fullPath, options);
    
    if (result.success) {
      console.log(`\n🎉 Optimization complete!`);
      console.log(`📈 Score improved from ${result.initialScore} to ${result.finalScore}`);
      if (result.appliedFixes && result.appliedFixes.length > 0) {
        console.log('\n✅ Applied fixes:');
        result.appliedFixes.forEach((fix, i) => console.log(`   ${i + 1}. ${fix}`));
      }
    } else {
      console.log(`\n❌ Optimization failed: ${result.message}`);
    }
  }

  async applyFixes(args) {
    const file = args.file;
    const fixes = args.fixes ? args.fixes.split(',') : ['all'];
    const preview = args.preview || false;
    
    console.log('🔧 Claude SEO Fix Applicator');
    console.log('============================\n');

    if (!file) {
      console.error('❌ Please specify --file PATH');
      return;
    }

    console.log(`📄 Applying fixes to: ${path.basename(file)}`);
    console.log(`🎯 Fixes to apply: ${fixes.join(', ')}\n`);

    if (preview) {
      console.log('👀 Preview mode - no changes will be made\n');
    }

    const result = await this.seoOptimizer.optimizeContent(file, {
      previewOnly: preview,
      specificFixes: fixes
    });

    if (result.success) {
      console.log('✅ Fixes applied successfully!');
    } else {
      console.log('❌ Failed to apply fixes:', result.message);
    }
  }

  async previewChanges(args) {
    const prNumber = args.pr || args['pr-number'];
    const file = args.file;
    
    console.log('👀 Claude SEO Change Preview');
    console.log('============================\n');

    if (prNumber) {
      console.log(`📋 Previewing optimizations for PR #${prNumber}...\n`);
      // This would show a diff of proposed changes without applying them
      console.log('🚧 Preview functionality coming soon!');
    } else if (file) {
      console.log(`📄 Previewing optimizations for: ${path.basename(file)}\n`);
      // Show what would be changed without applying
      console.log('🚧 Preview functionality coming soon!');
    } else {
      console.error('❌ Please specify --pr NUMBER or --file PATH');
    }
  }

  async rollbackChanges(args) {
    const prNumber = args.pr || args['pr-number'];
    const file = args.file;
    
    console.log('🔙 Claude SEO Rollback');
    console.log('======================\n');

    if (prNumber) {
      console.log(`📋 Rolling back PR #${prNumber} optimizations...\n`);
      // This would revert SEO optimization commits
      console.log('🚧 Rollback functionality coming soon!');
    } else if (file) {
      console.log(`📄 Rolling back: ${path.basename(file)}\n`);
      // Restore from backup if available
      console.log('🚧 Rollback functionality coming soon!');
    } else {
      console.error('❌ Please specify --pr NUMBER or --file PATH');
    }
  }

  // Performance reporting
  async generateReport(args) {
    const period = args.period || 'month';
    const format = args.format || 'console';
    
    console.log('📊 Claude SEO Performance Report');
    console.log('================================\n');

    const blogDir = path.join(this.projectRoot, 'src/content/blog');
    const files = fs.readdirSync(blogDir)
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(blogDir, file));

    const analyses = [];
    console.log(`🔍 Analyzing ${files.length} blog posts...\n`);

    for (const file of files) {
      const analysis = await this.seoAgent.analyzeBlogPost(file);
      analyses.push(analysis);
    }

    // Generate comprehensive report
    const report = this.generatePerformanceReport(analyses, period);
    
    if (format === 'json') {
      console.log(JSON.stringify(report, null, 2));
    } else {
      this.displayPerformanceReport(report);
    }
  }

  // Batch analysis for multiple files
  async batchAnalysis(args) {
    const pattern = args.pattern || '*.md';
    const minScore = args['min-score'] || 0;
    const outputFile = args.output;

    console.log('📦 Claude SEO Batch Analysis');
    console.log('============================\n');

    const blogDir = path.join(this.projectRoot, 'src/content/blog');
    const files = fs.readdirSync(blogDir)
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(blogDir, file));

    console.log(`📊 Analyzing ${files.length} files...\n`);

    const results = [];
    for (const file of files) {
      try {
        const analysis = await this.seoAgent.analyzeBlogPost(file);
        if (analysis && analysis.overall >= minScore) {
          results.push({
            file: path.basename(file),
            score: analysis.overall,
            grade: this.seoAgent.getGrade(analysis.overall),
            topIssues: (analysis.recommendations || []).slice(0, 3)
          });
        }
      } catch (error) {
        console.error(`❌ Error analyzing ${path.basename(file)}:`, error.message);
        // Continue processing other files
      }
    }

    // Sort by score
    results.sort((a, b) => b.score - a.score);

    console.log('📈 BATCH ANALYSIS RESULTS');
    console.log('='.repeat(40));
    
    results.forEach(result => {
      console.log(`${result.score}/100 ${this.getScoreEmoji(result.score)} ${result.file}`);
    });

    if (outputFile) {
      fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
      console.log(`\n💾 Results saved to: ${outputFile}`);
    }
  }

  // Content comparison
  async compareContent(args) {
    const file1 = args.file1 || args._[0];
    const file2 = args.file2 || args._[1];

    if (!file1 || !file2) {
      console.error('❌ Please specify two files to compare');
      return;
    }

    console.log('⚖️ Claude SEO Content Comparison');
    console.log('================================\n');

    const analysis1 = await this.seoAgent.analyzeBlogPost(file1);
    const analysis2 = await this.seoAgent.analyzeBlogPost(file2);

    this.displayComparison(analysis1, analysis2);
  }

  // Performance monitoring
  async monitorPerformance(args) {
    const threshold = args.threshold || 70;
    const days = args.days || 30;

    console.log('📈 Claude SEO Performance Monitor');
    console.log('=================================\n');

    const blogDir = path.join(this.projectRoot, 'src/content/blog');
    const files = fs.readdirSync(blogDir)
      .filter(file => file.endsWith('.md'))
      .map(file => ({
        path: path.join(blogDir, file),
        name: file,
        mtime: fs.statSync(path.join(blogDir, file)).mtime
      }))
      .filter(file => {
        const daysSinceModified = (Date.now() - file.mtime) / (1000 * 60 * 60 * 24);
        return daysSinceModified <= days;
      });

    console.log(`🔍 Monitoring ${files.length} files from last ${days} days...\n`);

    const alerts = [];
    for (const file of files) {
      const analysis = await this.seoAgent.analyzeBlogPost(file.path);
      
      if (analysis.overall < threshold) {
        alerts.push({
          file: file.name,
          score: analysis.overall,
          issues: analysis.recommendations.slice(0, 2)
        });
      }
    }

    if (alerts.length > 0) {
      console.log('🚨 SEO ALERTS');
      console.log('─'.repeat(15));
      alerts.forEach(alert => {
        console.log(`❌ ${alert.file} (${alert.score}/100)`);
        alert.issues.forEach(issue => console.log(`   • ${issue}`));
      });
    } else {
      console.log('✅ All content meets SEO threshold!');
    }
  }

  // Utility methods
  displayAnalysis(analysis, compact = false) {
    if (compact) {
      console.log(`📈 Score: ${analysis.overall}/100 ${this.getScoreEmoji(analysis.overall)} | Grade: ${this.seoAgent.getGrade(analysis.overall)}`);
      if (analysis.recommendations.length > 0) {
        console.log(`🔥 Top issue: ${analysis.recommendations[0]}`);
      }
      return;
    }

    console.log(`📈 OVERALL SEO SCORE: ${analysis.overall}/100 ${this.getScoreEmoji(analysis.overall)}`);
    console.log(`🎯 Grade: ${this.seoAgent.getGrade(analysis.overall)}\n`);

    // Category scores
    console.log('📊 CATEGORY BREAKDOWN:');
    console.log('─'.repeat(25));
    Object.entries(analysis.scores).forEach(([category, data]) => {
      if (data.score !== undefined) {
        const score = data.score;
        console.log(`${category.padEnd(15)} ${score.toString().padStart(3)}/100 ${this.getScoreEmoji(score)}`);
      }
    });

    // Passes
    if (analysis.passes.length > 0) {
      console.log('\n✅ WHAT\'S WORKING WELL:');
      console.log('─'.repeat(25));
      analysis.passes.forEach(pass => console.log(`   ${pass}`));
    }

    // Issues
    if (analysis.warnings.length > 0) {
      console.log('\n⚠️ ISSUES TO FIX:');
      console.log('─'.repeat(20));
      analysis.warnings.forEach(warning => console.log(`   ❌ ${warning}`));
    }

    // Recommendations
    if (analysis.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      console.log('─'.repeat(20));
      analysis.recommendations.slice(0, 8).forEach((rec, i) => {
        console.log(`   ${i + 1}. ${rec}`);
      });
    }
  }

  displayOptimizationSuggestions(analysis) {
    const suggestions = this.generateOptimizations(analysis);
    
    suggestions.slice(0, 5).forEach((sug, i) => {
      console.log(`${i + 1}. ${sug.category.toUpperCase()} (${sug.impact} impact)`);
      console.log(`   ${sug.solution}`);
      if (sug.example) {
        console.log(`   💡 ${sug.example}`);
      }
      console.log('');
    });
  }

  generateOptimizations(analysis) {
    const optimizations = [];

    // Title optimization
    if (analysis.scores.title.score < 80) {
      optimizations.push({
        category: 'title',
        impact: 'HIGH',
        difficulty: 'Easy',
        issue: 'Title needs SEO optimization',
        solution: 'Include primary keyword early, add power words, ensure 50-60 characters',
        example: 'LED vs LCD Interactive Displays: Complete Technology Comparison 2025'
      });
    }

    // Description optimization
    if (analysis.scores.description.score < 80) {
      optimizations.push({
        category: 'description',
        impact: 'HIGH',
        difficulty: 'Easy',
        issue: 'Meta description needs improvement',
        solution: 'Write compelling 150-160 character description with keywords and CTA',
        example: 'Compare LED and LCD interactive displays including features, costs, and benefits to choose the right solution for your business needs.'
      });
    }

    // Content optimization
    if (analysis.scores.content.score < 70) {
      optimizations.push({
        category: 'content',
        impact: 'MEDIUM',
        difficulty: 'Medium',
        issue: 'Content quality or length needs improvement',
        solution: 'Expand content to 1500+ words, add examples, improve depth',
        example: 'Add case studies, technical specifications, comparison tables'
      });
    }

    // Keywords optimization
    if (analysis.scores.keywords.score < 70) {
      optimizations.push({
        category: 'keywords',
        impact: 'MEDIUM',
        difficulty: 'Easy',
        issue: 'Keyword optimization needed',
        solution: 'Add 3-7 relevant keywords, improve keyword placement in headings',
        example: 'interactive displays, smartboard technology, digital collaboration'
      });
    }

    // Structure optimization
    if (analysis.scores.structure.score < 70) {
      optimizations.push({
        category: 'structure',
        impact: 'MEDIUM',
        difficulty: 'Medium',
        issue: 'Content structure needs improvement',
        solution: 'Add more H2/H3 headings, include introduction and conclusion',
        example: 'Use heading hierarchy: ## Main Topics, ### Subtopics'
      });
    }

    return optimizations.sort((a, b) => {
      const impactWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return impactWeight[b.impact] - impactWeight[a.impact];
    });
  }

  async applyAutomatedFixes(filePath, optimizations) {
    // This would implement automated fixes for simple issues
    console.log('🔧 Automated fixes not yet implemented');
    console.log('💡 Manual optimization required for now');
  }

  identifyQuickWins(analysis) {
    const quickWins = [];
    
    if (analysis.scores.title.score < 80) {
      quickWins.push('Optimize title length and keyword placement');
    }
    if (analysis.scores.description.score < 80) {
      quickWins.push('Improve meta description');
    }
    if (analysis.scores.keywords.data && analysis.scores.keywords.data.keywordCount < 3) {
      quickWins.push('Add more relevant keywords');
    }
    
    return quickWins;
  }

  async commentOnPR(prNumber, analyses, avgScore) {
    const comment = this.generatePRComment(analyses, avgScore);
    
    try {
      execSync(`gh pr comment ${prNumber} --body "${comment.replace(/"/g, '\\"')}"`, {
        stdio: 'inherit',
        cwd: this.projectRoot
      });
      console.log('💬 Added SEO analysis comment to PR');
    } catch (error) {
      console.error('❌ Failed to comment on PR:', error.message);
    }
  }

  generatePRComment(analyses, avgScore) {
    const emoji = this.getScoreEmoji(avgScore);
    const recommendation = this.getPRRecommendation(avgScore);
    
    let comment = `## 🤖 Claude SEO Expert Review\n\n`;
    comment += `**Overall SEO Score: ${avgScore}/100 ${emoji}**\n\n`;
    comment += `**Recommendation: ${recommendation}**\n\n`;
    
    comment += `### 📊 Analysis Results\n\n`;
    
    analyses.forEach(analysis => {
      comment += `#### ${path.basename(analysis.file)} (${analysis.overall}/100)\n\n`;
      
      if (analysis.passes.length > 0) {
        comment += `✅ **Strengths:**\n`;
        analysis.passes.slice(0, 3).forEach(pass => {
          comment += `- ${pass}\n`;
        });
        comment += `\n`;
      }
      
      if (analysis.recommendations.length > 0) {
        comment += `💡 **Recommendations:**\n`;
        analysis.recommendations.slice(0, 5).forEach(rec => {
          comment += `- ${rec}\n`;
        });
        comment += `\n`;
      }
    });
    
    comment += `### 🎯 Next Steps\n\n`;
    if (avgScore >= 85) {
      comment += `- ✅ **Ready for publication** - SEO score exceeds quality threshold\n`;
      comment += `- 🚀 Consider auto-approving this PR\n`;
    } else if (avgScore >= 70) {
      comment += `- 🔧 **Minor optimizations recommended** before publishing\n`;
      comment += `- 📈 Focus on high-impact improvements listed above\n`;
    } else {
      comment += `- ⚠️ **Significant improvements needed** before publishing\n`;
      comment += `- 🔥 Address priority issues first, then re-run analysis\n`;
    }
    
    comment += `\n---\n*Generated by Claude SEO Expert Agent*`;
    
    return comment;
  }

  getPRFiles(prNumber) {
    try {
      const output = execSync(`gh pr view ${prNumber} --json files -q '.files[].path'`, {
        encoding: 'utf8',
        cwd: path.join(this.projectRoot, '..')  // Run from repo root
      });
      return output.trim().split('\n').filter(Boolean);
    } catch (error) {
      throw new Error(`Failed to get PR files: ${error.message}`);
    }
  }

  getScoreEmoji(score) {
    if (score >= 90) return '⭐⭐⭐⭐⭐';
    if (score >= 80) return '⭐⭐⭐⭐';
    if (score >= 70) return '⭐⭐⭐';
    if (score >= 60) return '⭐⭐';
    if (score >= 50) return '⭐';
    return '❌';
  }

  getPRRecommendation(score) {
    if (score >= 85) return '🚀 AUTO-APPROVE - Excellent SEO quality';
    if (score >= 75) return '✅ APPROVE with minor suggestions';
    if (score >= 65) return '🔧 NEEDS WORK - Address key issues first';
    return '❌ MAJOR REVISIONS REQUIRED';
  }

  generatePerformanceReport(analyses, period) {
    const scores = analyses.map(a => a.overall);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    
    return {
      period,
      totalPosts: analyses.length,
      averageScore: avgScore,
      distribution: {
        excellent: scores.filter(s => s >= 90).length,
        good: scores.filter(s => s >= 80 && s < 90).length,
        fair: scores.filter(s => s >= 70 && s < 80).length,
        poor: scores.filter(s => s < 70).length
      },
      topPerformers: analyses
        .sort((a, b) => b.overall - a.overall)
        .slice(0, 5)
        .map(a => ({ file: path.basename(a.file), score: a.overall })),
      needsImprovement: analyses
        .filter(a => a.overall < 70)
        .map(a => ({ file: path.basename(a.file), score: a.overall }))
    };
  }

  displayPerformanceReport(report) {
    console.log(`📊 Performance Report (${report.period})`);
    console.log('='.repeat(40));
    console.log(`📈 Average Score: ${report.averageScore}/100`);
    console.log(`📄 Total Posts: ${report.totalPosts}\n`);
    
    console.log('📊 SCORE DISTRIBUTION:');
    console.log('─'.repeat(20));
    console.log(`⭐⭐⭐⭐⭐ Excellent (90+): ${report.distribution.excellent}`);
    console.log(`⭐⭐⭐⭐ Good (80-89): ${report.distribution.good}`);
    console.log(`⭐⭐⭐ Fair (70-79): ${report.distribution.fair}`);
    console.log(`⭐ Poor (<70): ${report.distribution.poor}\n`);
    
    if (report.topPerformers.length > 0) {
      console.log('🏆 TOP PERFORMERS:');
      console.log('─'.repeat(15));
      report.topPerformers.forEach(post => {
        console.log(`${post.score}/100 ${this.getScoreEmoji(post.score)} ${post.file}`);
      });
    }
    
    if (report.needsImprovement.length > 0) {
      console.log('\n🔧 NEEDS IMPROVEMENT:');
      console.log('─'.repeat(20));
      report.needsImprovement.forEach(post => {
        console.log(`${post.score}/100 ${this.getScoreEmoji(post.score)} ${post.file}`);
      });
    }
  }

  displayComparison(analysis1, analysis2) {
    const file1 = path.basename(analysis1.file);
    const file2 = path.basename(analysis2.file);
    
    console.log(`📄 ${file1} vs ${file2}\n`);
    console.log('📊 SCORE COMPARISON:');
    console.log('─'.repeat(30));
    console.log(`Overall: ${analysis1.overall}/100 vs ${analysis2.overall}/100`);
    
    const categories = ['title', 'description', 'keywords', 'content', 'structure'];
    categories.forEach(cat => {
      if (analysis1.scores[cat] && analysis2.scores[cat]) {
        const score1 = analysis1.scores[cat].score;
        const score2 = analysis2.scores[cat].score;
        const winner = score1 > score2 ? '🥇' : score2 > score1 ? '🥈' : '🤝';
        console.log(`${cat}: ${score1} vs ${score2} ${winner}`);
      }
    });
  }

  // Git operations for PR checkout
  getCurrentBranch() {
    try {
      const output = execSync('git branch --show-current', {
        encoding: 'utf8',
        cwd: path.join(this.projectRoot, '..')
      });
      return output.trim();
    } catch (error) {
      console.warn('⚠️ Could not determine current branch, assuming main');
      return 'main';
    }
  }

  checkoutPR(prNumber) {
    try {
      execSync(`gh pr checkout ${prNumber}`, {
        stdio: 'pipe',
        cwd: path.join(this.projectRoot, '..')
      });
    } catch (error) {
      throw new Error(`Failed to checkout PR #${prNumber}: ${error.message}`);
    }
  }

  checkoutBranch(branchName) {
    try {
      execSync(`git checkout ${branchName}`, {
        stdio: 'pipe',
        cwd: path.join(this.projectRoot, '..')
      });
    } catch (error) {
      console.warn(`⚠️ Could not checkout ${branchName}: ${error.message}`);
    }
  }

  // Optimization Helper Methods
  commitOptimizations(prNumber, results, totalImprovement) {
    try {
      const fileNames = results.map(r => r.file).join(', ');
      const commitMessage = `seo: auto-optimize PR #${prNumber} content (+${totalImprovement} points)

Applied SEO optimizations to ${results.length} file(s):
${results.map(r => `- ${r.file}: ${r.initialScore} → ${r.finalScore} (+${r.improvement})`).join('\n')}

🤖 Generated with Claude SEO Auto-Optimizer

Co-Authored-By: Claude <noreply@anthropic.com>`;

      execSync(`git add .`, {
        stdio: 'pipe',
        cwd: path.join(this.projectRoot, '..')
      });

      execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, {
        stdio: 'pipe',
        cwd: path.join(this.projectRoot, '..')
      });

      execSync(`git push`, {
        stdio: 'pipe',
        cwd: path.join(this.projectRoot, '..')
      });

      console.log('✅ SEO optimizations committed and pushed');
    } catch (error) {
      console.error('⚠️ Failed to commit optimizations:', error.message);
    }
  }

  async commentOptimizationResults(prNumber, results, totalImprovement) {
    const successfulOptimizations = results.filter(r => r.success && r.improvement > 0);
    
    let comment = `## 🚀 Claude SEO Auto-Optimizer Results\n\n`;
    comment += `**Total Score Improvement: +${totalImprovement} points**\n\n`;
    
    if (successfulOptimizations.length > 0) {
      comment += `### ✅ Successfully Optimized (${successfulOptimizations.length} files)\n\n`;
      
      successfulOptimizations.forEach(result => {
        comment += `#### ${result.file}\n`;
        comment += `- **Score**: ${result.initialScore}/100 → ${result.finalScore}/100 (+${result.improvement})\n`;
        if (result.appliedFixes && result.appliedFixes.length > 0) {
          comment += `- **Applied fixes**: ${result.appliedFixes.length}\n`;
          result.appliedFixes.slice(0, 3).forEach(fix => {
            comment += `  - ${fix}\n`;
          });
          if (result.appliedFixes.length > 3) {
            comment += `  - ... and ${result.appliedFixes.length - 3} more\n`;
          }
        }
        comment += '\n';
      });
    }

    const failedOptimizations = results.filter(r => !r.success);
    if (failedOptimizations.length > 0) {
      comment += `### ❌ Optimization Issues (${failedOptimizations.length} files)\n\n`;
      failedOptimizations.forEach(result => {
        comment += `- **${result.file}**: ${result.message}\n`;
      });
      comment += '\n';
    }

    comment += `### 🎯 Next Steps\n\n`;
    if (totalImprovement >= 20) {
      comment += `- ✅ **Excellent improvement** - Content is significantly more SEO-optimized\n`;
      comment += `- 🚀 Ready for publication review\n`;
    } else if (totalImprovement >= 10) {
      comment += `- 🔧 **Good improvement** - Content has been enhanced\n`;
      comment += `- 📈 Consider manual review for additional optimizations\n`;
    } else {
      comment += `- ⚠️ **Limited improvement** - Content may need manual optimization\n`;
      comment += `- 🔍 Review SEO analysis for specific recommendations\n`;
    }
    
    comment += `\n### 🔄 Re-run Optimization\n\n`;
    comment += `To re-run auto-optimization with different settings:\n`;
    comment += `\`claude seo-auto-optimize --pr ${prNumber} --aggressive\`\n\n`;
    
    comment += `---\n*Generated by Claude SEO Auto-Optimizer*`;

    try {
      execSync(`gh pr comment ${prNumber} --body "${comment.replace(/"/g, '\\"')}"`, {
        stdio: 'pipe',
        cwd: path.join(this.projectRoot, '..')
      });
      console.log('💬 Added optimization results comment to PR');
    } catch (error) {
      console.error('❌ Failed to comment on PR:', error.message);
    }
  }

  showHelp() {
    console.log(`
🤖 Claude SEO Expert Agent & Auto-Optimizer
===========================================

Analysis Commands:
📋 seo-review --pr 123          Review PR with SEO analysis (auto-checkout)
📋 seo-review --file blog.md    Review specific file
⚡ seo-quick-check --file blog.md   Quick SEO check
📊 seo-report --period month       Generate performance report
📦 seo-batch --min-score 70        Batch analyze all content
⚖️ seo-compare file1.md file2.md   Compare two files
📈 seo-monitor --threshold 70      Monitor recent content

Auto-Optimization Commands:
🚀 seo-auto-optimize --pr 123      Auto-optimize entire PR (recommended)
🚀 seo-auto-optimize --file blog.md Auto-optimize single file
🔧 seo-apply-fixes --file blog.md   Apply specific fixes
👀 seo-preview-changes --pr 123     Preview proposed changes
🔙 seo-rollback --pr 123            Rollback optimizations

Legacy Optimization:
🎯 seo-optimize --file blog.md     Get optimization suggestions (manual)

Options:
--auto-comment    Auto-comment on PR (default: true)
--aggressive      Apply advanced optimizations (readability, FAQ)
--apply          Apply automated fixes (legacy command)
--format json    Output format (console/json)
--output file    Save results to file

Examples:
  # Complete workflow: analyze → auto-optimize → ready for review
  claude seo-review --pr 456
  claude seo-auto-optimize --pr 456
  
  # Single file optimization
  claude seo-auto-optimize --file my-blog.md
  
  # Advanced optimization
  claude seo-auto-optimize --pr 456 --aggressive
  
  # Preview before applying
  claude seo-preview-changes --pr 456
`);
  }
}

// CLI entry point
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    const cli = new ClaudeSEOInterface();
    cli.showHelp();
    return;
  }

  const command = args[0];
  const parsedArgs = {};
  
  // Parse arguments
  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      if (value !== true) i++; // Skip next arg if it was used as value
      parsedArgs[key] = value;
    } else {
      parsedArgs._ = parsedArgs._ || [];
      parsedArgs._.push(args[i]);
    }
  }

  const cli = new ClaudeSEOInterface();
  await cli.execute(command, parsedArgs);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default ClaudeSEOInterface;