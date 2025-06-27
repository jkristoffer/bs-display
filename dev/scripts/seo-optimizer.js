#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import SEOAgent from './seo-agent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SEOOptimizer {
  constructor() {
    this.seoAgent = new SEOAgent();
    this.projectRoot = path.join(__dirname, '..');
    this.industryKeywords = [
      'interactive display', 'smartboard', 'whiteboard', 'touch screen',
      'digital display', 'collaboration', 'presentation', 'meeting room',
      'classroom', 'education', 'business', 'technology', 'LED', 'LCD',
      'OLED', 'capacitive', 'infrared', 'electromagnetic', '4K', '8K'
    ];
    this.powerWords = [
      'Ultimate', 'Complete', 'Professional', 'Advanced', 'Best', 'Top',
      'Essential', 'Comprehensive', 'Expert', 'Perfect', 'Premium', 'Smart'
    ];
  }

  // Main optimization entry point
  async optimizeContent(filePath, options = {}) {
    console.log('🎯 SEO Auto-Optimizer Starting...\n');
    console.log(`📄 File: ${path.basename(filePath)}`);

    // Safety check: Validate file
    const safetyCheck = this.performSafetyChecks(filePath, options);
    if (!safetyCheck.safe) {
      console.error(`❌ Safety check failed: ${safetyCheck.reason}`);
      return { success: false, message: safetyCheck.reason, safety: false };
    }

    // Backup original file
    const backupPath = this.createBackup(filePath);
    console.log(`💾 Backup created: ${path.basename(backupPath)}`);

    try {
      // Run initial analysis
      console.log('\n🔍 Running initial SEO analysis...');
      const initialAnalysis = await this.seoAgent.analyzeBlogPost(filePath);
      console.log(`📊 Initial Score: ${initialAnalysis.overall}/100`);

      if (initialAnalysis.overall >= 85) {
        console.log('✅ Content already optimized! No changes needed.');
        this.removeBackup(backupPath);
        return { success: true, message: 'Content already optimized', score: initialAnalysis.overall };
      }

      // Human approval gate for major changes
      if (options.requireApproval && this.requiresHumanApproval(initialAnalysis)) {
        console.log('\n⚠️ HUMAN APPROVAL REQUIRED');
        console.log('This content requires significant changes that need human review.');
        console.log('Run with --force to bypass approval or review manually first.');
        this.removeBackup(backupPath);
        return { success: false, message: 'Human approval required for major changes', requiresApproval: true };
      }

      // Read current content
      const content = fs.readFileSync(filePath, 'utf8');
      const { frontmatter, body } = this.parseMdFile(content);

      // Apply optimizations
      let optimizedFrontmatter = { ...frontmatter };
      let optimizedBody = body;
      const appliedFixes = [];

      // 1. Title Optimization
      if (initialAnalysis.scores.title && initialAnalysis.scores.title.score < 80) {
        console.log('\n🔧 Optimizing title...');
        const titleResult = this.optimizeTitle(optimizedFrontmatter.title, body, options);
        if (titleResult.improved) {
          optimizedFrontmatter.title = titleResult.optimized;
          appliedFixes.push(`Title: "${frontmatter.title}" → "${titleResult.optimized}"`);
          console.log(`✅ Title optimized: ${titleResult.optimized}`);
        }
      }

      // 2. Meta Description Optimization
      if (initialAnalysis.scores.description && initialAnalysis.scores.description.score < 80) {
        console.log('\n🔧 Optimizing meta description...');
        const descResult = this.optimizeDescription(optimizedFrontmatter.description, optimizedFrontmatter.title, body, options);
        if (descResult.improved) {
          optimizedFrontmatter.description = descResult.optimized;
          appliedFixes.push(`Description optimized (${descResult.optimized.length} chars)`);
          console.log(`✅ Description optimized: ${descResult.optimized.substring(0, 100)}...`);
        }
      }

      // 3. Keywords Enhancement
      if (initialAnalysis.scores.keywords && initialAnalysis.scores.keywords.score < 70) {
        console.log('\n🔧 Enhancing keywords...');
        const keywordResult = this.enhanceKeywords(optimizedFrontmatter, body, options);
        if (keywordResult.improved) {
          optimizedFrontmatter = { ...optimizedFrontmatter, ...keywordResult.frontmatter };
          appliedFixes.push(`Keywords: Added ${keywordResult.addedKeywords.length} keywords`);
          console.log(`✅ Keywords enhanced: ${keywordResult.addedKeywords.join(', ')}`);
        }
      }

      // 4. Content Structure Optimization
      if (initialAnalysis.scores.structure && initialAnalysis.scores.structure.score < 80) {
        console.log('\n🔧 Improving content structure...');
        const structureResult = this.optimizeStructure(optimizedBody, optimizedFrontmatter.title, options);
        if (structureResult.improved) {
          optimizedBody = structureResult.optimized;
          appliedFixes.push(`Structure: ${structureResult.improvements.join(', ')}`);
          console.log(`✅ Structure improved: ${structureResult.improvements.join(', ')}`);
        }
      }

      // 5. Readability Optimization (selective)
      if (initialAnalysis.scores.readability && initialAnalysis.scores.readability.score < 60 && options.improveReadability) {
        console.log('\n🔧 Improving readability...');
        const readabilityResult = this.optimizeReadability(optimizedBody, options);
        if (readabilityResult.improved) {
          optimizedBody = readabilityResult.optimized;
          appliedFixes.push(`Readability: ${readabilityResult.improvements.join(', ')}`);
          console.log(`✅ Readability improved: ${readabilityResult.improvements.join(', ')}`);
        }
      }

      // Write optimized content back to file
      const optimizedContent = this.reconstructMdFile(optimizedFrontmatter, optimizedBody);
      fs.writeFileSync(filePath, optimizedContent, 'utf8');

      // Run final analysis
      console.log('\n🔍 Running final SEO analysis...');
      const finalAnalysis = await this.seoAgent.analyzeBlogPost(filePath);
      const improvement = finalAnalysis.overall - initialAnalysis.overall;

      console.log('\n📊 OPTIMIZATION RESULTS');
      console.log('='.repeat(40));
      console.log(`📈 Score: ${initialAnalysis.overall}/100 → ${finalAnalysis.overall}/100 (+${improvement})`);
      console.log(`🎯 Grade: ${this.seoAgent.getGrade(initialAnalysis.overall)} → ${this.seoAgent.getGrade(finalAnalysis.overall)}`);
      
      if (appliedFixes.length > 0) {
        console.log('\n✅ APPLIED OPTIMIZATIONS:');
        appliedFixes.forEach((fix, i) => console.log(`   ${i + 1}. ${fix}`));
      }

      // Safety check - rollback if score decreased
      if (finalAnalysis.overall < initialAnalysis.overall) {
        console.log('\n⚠️ Score decreased - rolling back changes...');
        this.rollbackFromBackup(filePath, backupPath);
        return { success: false, message: 'Optimization decreased score - rolled back', score: initialAnalysis.overall };
      }

      // Clean up backup on success
      this.removeBackup(backupPath);

      return {
        success: true,
        initialScore: initialAnalysis.overall,
        finalScore: finalAnalysis.overall,
        improvement: improvement,
        appliedFixes: appliedFixes,
        message: `Successfully optimized! Score improved by ${improvement} points.`
      };

    } catch (error) {
      console.error('\n❌ Optimization failed:', error.message);
      // Restore from backup on error
      this.rollbackFromBackup(filePath, backupPath);
      return { success: false, message: `Optimization failed: ${error.message}`, error: true };
    }
  }

  // Title Optimization
  optimizeTitle(title, body, options = {}) {
    if (!title) return { improved: false };

    let optimized = title;
    let improved = false;
    const changes = [];

    // Extract primary topic/keyword from content
    const primaryKeyword = this.extractPrimaryKeyword(title, body);

    // Length optimization (50-60 characters ideal)
    if (title.length > 70) {
      optimized = this.shortenTitle(optimized, primaryKeyword);
      improved = true;
      changes.push('shortened for optimal length');
    } else if (title.length < 40) {
      optimized = this.expandTitle(optimized, primaryKeyword, body);
      improved = true;
      changes.push('expanded for better SEO');
    }

    // Add year for freshness if missing
    if (!optimized.includes('2025') && !optimized.includes('2024')) {
      optimized = this.addYearToTitle(optimized);
      improved = true;
      changes.push('added current year');
    }

    // Add power words if missing and length allows
    if (optimized.length < 55 && !this.hasPowerWords(optimized)) {
      optimized = this.addPowerWordToTitle(optimized);
      improved = true;
      changes.push('added power word');
    }

    // Ensure primary keyword is early in title
    if (primaryKeyword && optimized.toLowerCase().indexOf(primaryKeyword.toLowerCase()) > 20) {
      optimized = this.moveKeywordToFront(optimized, primaryKeyword);
      improved = true;
      changes.push('moved primary keyword forward');
    }

    return {
      improved,
      optimized: optimized.trim(),
      changes,
      originalLength: title.length,
      newLength: optimized.length
    };
  }

  // Meta Description Optimization
  optimizeDescription(description, title, body, options = {}) {
    if (!description) {
      // Generate new description from content
      const generated = this.generateDescription(title, body);
      return {
        improved: true,
        optimized: generated,
        changes: ['generated from content'],
        action: 'created'
      };
    }

    let optimized = description;
    let improved = false;
    const changes = [];

    // Length optimization (150-160 characters ideal)
    if (description.length > 160) {
      optimized = this.shortenDescription(optimized);
      improved = true;
      changes.push('shortened to optimal length');
    } else if (description.length < 140) {
      optimized = this.expandDescription(optimized, title, body);
      improved = true;
      changes.push('expanded for better engagement');
    }

    // Add call-to-action if missing
    if (!this.hasCallToAction(optimized)) {
      optimized = this.addCallToAction(optimized);
      improved = true;
      changes.push('added call-to-action');
    }

    // Ensure primary keyword is included
    const primaryKeyword = this.extractPrimaryKeyword(title, body);
    if (primaryKeyword && !optimized.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      optimized = this.addKeywordToDescription(optimized, primaryKeyword);
      improved = true;
      changes.push('added primary keyword');
    }

    return {
      improved,
      optimized: optimized.trim(),
      changes,
      originalLength: description.length,
      newLength: optimized.length
    };
  }

  // Keywords Enhancement
  enhanceKeywords(frontmatter, body, options = {}) {
    const existingKeywords = frontmatter.keywords || [];
    const existingTags = frontmatter.tags || [];
    
    // Extract relevant keywords from content
    const contentKeywords = this.extractContentKeywords(body);
    const industryKeywords = this.findRelevantIndustryKeywords(body);
    const semanticKeywords = this.generateSemanticKeywords(frontmatter.title, body);

    // Combine and deduplicate
    const allKeywords = [...existingKeywords, ...existingTags];
    const newKeywords = [];

    // Add high-value keywords that aren't already present
    [...contentKeywords, ...industryKeywords, ...semanticKeywords].forEach(keyword => {
      if (!allKeywords.some(existing => 
        existing.toLowerCase().includes(keyword.toLowerCase()) || 
        keyword.toLowerCase().includes(existing.toLowerCase())
      )) {
        newKeywords.push(keyword);
      }
    });

    // Limit to top 5-7 new keywords
    const selectedKeywords = newKeywords.slice(0, Math.min(7, newKeywords.length));

    if (selectedKeywords.length === 0) {
      return { improved: false };
    }

    return {
      improved: true,
      frontmatter: {
        keywords: [...existingKeywords, ...selectedKeywords].slice(0, 10),
        tags: frontmatter.tags || selectedKeywords.slice(0, 5)
      },
      addedKeywords: selectedKeywords,
      changes: [`added ${selectedKeywords.length} relevant keywords`]
    };
  }

  // Content Structure Optimization
  optimizeStructure(body, title, options = {}) {
    let optimized = body;
    let improved = false;
    const improvements = [];

    // Add introduction if missing
    if (!this.hasIntroduction(optimized)) {
      const intro = this.generateIntroduction(title, optimized);
      optimized = intro + '\n\n' + optimized;
      improved = true;
      improvements.push('added introduction');
    }

    // Add conclusion if missing
    if (!this.hasConclusion(optimized)) {
      const conclusion = this.generateConclusion(title, optimized);
      optimized = optimized + '\n\n' + conclusion;
      improved = true;
      improvements.push('added conclusion');
    }

    // Improve heading structure
    const headingResult = this.optimizeHeadings(optimized, title);
    if (headingResult.improved) {
      optimized = headingResult.optimized;
      improved = true;
      improvements.push(...headingResult.improvements);
    }

    // Add FAQ section if beneficial
    if (this.shouldAddFAQ(optimized) && options.addFAQ !== false) {
      const faq = this.generateFAQSection(title, optimized);
      optimized = optimized + '\n\n' + faq;
      improved = true;
      improvements.push('added FAQ section');
    }

    return {
      improved,
      optimized,
      improvements
    };
  }

  // Readability Optimization
  optimizeReadability(body, options = {}) {
    let optimized = body;
    let improved = false;
    const improvements = [];

    // Break up long paragraphs
    const paragraphResult = this.optimizeParagraphs(optimized);
    if (paragraphResult.improved) {
      optimized = paragraphResult.optimized;
      improved = true;
      improvements.push('improved paragraph structure');
    }

    // Optimize sentence length
    const sentenceResult = this.optimizeSentences(optimized);
    if (sentenceResult.improved) {
      optimized = sentenceResult.optimized;
      improved = true;
      improvements.push('optimized sentence length');
    }

    // Add transition words
    const transitionResult = this.addTransitionWords(optimized);
    if (transitionResult.improved) {
      optimized = transitionResult.optimized;
      improved = true;
      improvements.push('added transition words');
    }

    return {
      improved,
      optimized,
      improvements
    };
  }

  // Helper Methods for Title Optimization
  extractPrimaryKeyword(title, body) {
    const titleWords = title.toLowerCase().split(' ').filter(word => word.length > 3);
    const bodyLower = body.toLowerCase();
    
    // Find most frequent meaningful word from title that appears in body
    let maxCount = 0;
    let primaryKeyword = '';
    
    titleWords.forEach(word => {
      const count = (bodyLower.match(new RegExp(word, 'g')) || []).length;
      if (count > maxCount) {
        maxCount = count;
        primaryKeyword = word;
      }
    });

    // Check for industry keywords in title
    for (const keyword of this.industryKeywords) {
      if (title.toLowerCase().includes(keyword.toLowerCase())) {
        return keyword;
      }
    }

    return primaryKeyword || titleWords[0] || '';
  }

  shortenTitle(title, primaryKeyword) {
    // Remove filler words while preserving keywords
    const fillerWords = ['the', 'of', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by'];
    const words = title.split(' ');
    
    let shortened = words.filter(word => 
      !fillerWords.includes(word.toLowerCase()) || 
      word.toLowerCase() === primaryKeyword.toLowerCase()
    ).join(' ');

    // If still too long, trim from the end
    if (shortened.length > 60) {
      shortened = shortened.substring(0, 57) + '...';
    }

    return shortened;
  }

  expandTitle(title, primaryKeyword, body) {
    // Add descriptive words or current year
    if (title.length < 40) {
      // Check what type of content this is
      if (body.includes('how to') || body.includes('guide')) {
        return `${title}: Complete Guide 2025`;
      } else if (body.includes('vs') || body.includes('comparison')) {
        return `${title}: Technology Comparison 2025`;
      } else if (body.includes('best') || body.includes('top')) {
        return `${title}: Expert Analysis 2025`;
      } else {
        return `${title}: Professional Insights 2025`;
      }
    }
    return title;
  }

  addYearToTitle(title) {
    if (title.length <= 50) {
      return `${title} 2025`;
    }
    return title.replace(/\s*$/, ' 2025');
  }

  hasPowerWords(title) {
    return this.powerWords.some(word => 
      title.toLowerCase().includes(word.toLowerCase())
    );
  }

  addPowerWordToTitle(title) {
    // Choose appropriate power word based on content type
    if (title.toLowerCase().includes('guide')) {
      return title.replace('Guide', 'Complete Guide');
    } else if (title.toLowerCase().includes('comparison')) {
      return title.replace('Comparison', 'Ultimate Comparison');
    } else {
      return `Complete ${title}`;
    }
  }

  moveKeywordToFront(title, keyword) {
    const words = title.split(' ');
    const keywordIndex = words.findIndex(word => 
      word.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (keywordIndex > 2) {
      const keywordWord = words.splice(keywordIndex, 1)[0];
      words.unshift(keywordWord);
      return words.join(' ');
    }
    
    return title;
  }

  // Helper Methods for Description Optimization
  generateDescription(title, body) {
    // Extract first meaningful paragraph
    const paragraphs = body.split('\n\n').filter(p => 
      p.trim().length > 50 && !p.startsWith('#') && !p.startsWith('!')
    );
    
    if (paragraphs.length > 0) {
      let description = paragraphs[0].substring(0, 140);
      description = description.replace(/\[.*?\]\(.*?\)/g, ''); // Remove markdown links
      description = description.replace(/[#*_`]/g, ''); // Remove markdown formatting
      
      // Add call-to-action
      description += '. Learn more about interactive display solutions.';
      
      return description.substring(0, 160);
    }
    
    // Fallback: generate from title
    return `Discover everything about ${title.toLowerCase()}. Expert insights, comparisons, and professional recommendations for your business needs.`;
  }

  shortenDescription(description) {
    // Remove unnecessary words while keeping the meaning
    let shortened = description;
    
    // Remove parenthetical information first
    shortened = shortened.replace(/\s*\([^)]*\)/g, '');
    
    // If still too long, trim sentences
    if (shortened.length > 160) {
      const sentences = shortened.split('.').filter(s => s.trim());
      shortened = sentences[0] + '.';
      
      // If still too long, trim words
      if (shortened.length > 160) {
        const words = shortened.split(' ');
        shortened = words.slice(0, -1).join(' ') + '...';
      }
    }
    
    return shortened.substring(0, 160);
  }

  expandDescription(description, title, body) {
    if (description.length < 140) {
      // Add relevant details from content
      const benefits = this.extractBenefits(body);
      if (benefits.length > 0) {
        const addition = ` Features ${benefits[0].toLowerCase()}`;
        if ((description + addition).length <= 160) {
          return description + addition + '.';
        }
      }
      
      // Add generic but valuable information
      const addition = ' Expert insights and recommendations';
      if ((description + addition).length <= 160) {
        return description + addition + '.';
      }
    }
    
    return description;
  }

  hasCallToAction(description) {
    const ctaWords = ['learn', 'discover', 'find', 'explore', 'compare', 'choose', 'get', 'see'];
    return ctaWords.some(word => description.toLowerCase().includes(word));
  }

  addCallToAction(description) {
    // Remove trailing period if present
    let desc = description.replace(/\.$/, '');
    
    // Add appropriate CTA based on content type
    if (description.includes('comparison') || description.includes('vs')) {
      desc += '. Compare features and choose the best solution';
    } else if (description.includes('guide') || description.includes('how')) {
      desc += '. Learn step-by-step implementation';
    } else {
      desc += '. Discover the best solutions for your needs';
    }
    
    return desc.substring(0, 160);
  }

  addKeywordToDescription(description, keyword) {
    // Try to naturally incorporate the keyword
    if (description.length + keyword.length + 10 <= 160) {
      // Add at the beginning if it fits naturally
      if (!description.toLowerCase().includes(keyword.toLowerCase())) {
        return `${keyword} solutions: ${description}`;
      }
    }
    return description;
  }

  // Helper Methods for Keywords Enhancement
  extractContentKeywords(body) {
    const words = body.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    // Count word frequency
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    // Return top frequent words that aren't common words
    const commonWords = ['this', 'that', 'with', 'have', 'they', 'will', 'from', 'been', 'more', 'like', 'time', 'very', 'when', 'much', 'can', 'said', 'each', 'which', 'their', 'make', 'would', 'there', 'could', 'way'];
    
    return Object.entries(wordCount)
      .filter(([word, count]) => count >= 3 && !commonWords.includes(word))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }

  findRelevantIndustryKeywords(body) {
    return this.industryKeywords.filter(keyword => 
      body.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  generateSemanticKeywords(title, body) {
    const content = (title + ' ' + body).toLowerCase();
    const semanticMap = {
      'interactive display': ['digital signage', 'touch display', 'smart display'],
      'smartboard': ['interactive whiteboard', 'digital whiteboard', 'smart whiteboard'],
      'education': ['classroom technology', 'learning tools', 'educational technology'],
      'business': ['collaboration tools', 'meeting room technology', 'presentation solutions'],
      'technology': ['innovation', 'digital solutions', 'advanced technology']
    };
    
    const semanticKeywords = [];
    Object.entries(semanticMap).forEach(([key, related]) => {
      if (content.includes(key)) {
        semanticKeywords.push(...related.filter(keyword => 
          !content.includes(keyword)
        ));
      }
    });
    
    return semanticKeywords.slice(0, 3);
  }

  // Helper Methods for Structure Optimization
  hasIntroduction(body) {
    const firstParagraph = body.split('\n\n')[0];
    // Check if first paragraph introduces the topic
    return firstParagraph && firstParagraph.length > 100 && 
           !firstParagraph.startsWith('#') && 
           (firstParagraph.includes('discover') || 
            firstParagraph.includes('learn') || 
            firstParagraph.includes('guide') ||
            firstParagraph.includes('explore'));
  }

  generateIntroduction(title, body) {
    const topic = title.toLowerCase().replace(/[^\w\s]/g, '');
    return `Discover everything you need to know about ${topic}. This comprehensive guide provides expert insights, practical recommendations, and essential information to help you make informed decisions.`;
  }

  hasConclusion(body) {
    const lastParagraph = body.split('\n\n').pop();
    return lastParagraph && 
           (lastParagraph.includes('conclusion') || 
            lastParagraph.includes('summary') || 
            lastParagraph.includes('final') ||
            lastParagraph.includes('contact us'));
  }

  generateConclusion(title, body) {
    return `## Conclusion\n\nChoosing the right solution requires careful consideration of your specific needs and requirements. For expert guidance and personalized recommendations, contact our team of interactive display specialists.\n\n**Ready to transform your space?** [Contact us today](mailto:info@example.com) for a free consultation and discover how our solutions can enhance your productivity and collaboration.`;
  }

  optimizeHeadings(body, title) {
    let optimized = body;
    let improved = false;
    const improvements = [];

    // Ensure proper heading hierarchy
    const lines = optimized.split('\n');
    let hasH2 = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Convert single # to ## for better structure
      if (line.startsWith('# ') && !line.startsWith('## ')) {
        lines[i] = '## ' + line.substring(2);
        hasH2 = true;
        improved = true;
      }
    }
    
    if (improved) {
      optimized = lines.join('\n');
      improvements.push('improved heading hierarchy');
    }

    return { improved, optimized, improvements };
  }

  shouldAddFAQ(body) {
    // Add FAQ if content is substantial but lacks interactive elements
    const wordCount = body.split(/\s+/).length;
    const hasQuestions = body.includes('?');
    const hasLists = body.includes('1.') || body.includes('-');
    
    return wordCount > 800 && !hasQuestions && hasLists;
  }

  generateFAQSection(title, body) {
    const topic = title.toLowerCase().replace(/[^\w\s]/g, '');
    
    return `## Frequently Asked Questions

### What are the key benefits of ${topic}?
${topic} offers enhanced collaboration, improved productivity, and modern technology integration that transforms how teams work together.

### How do I choose the right solution?
Consider your space size, usage requirements, budget constraints, and integration needs. Our experts can help you evaluate these factors.

### What support is available?
We provide comprehensive support including installation, training, maintenance, and ongoing technical assistance to ensure optimal performance.`;
  }

  // Helper Methods for Readability
  optimizeParagraphs(body) {
    const paragraphs = body.split('\n\n');
    let improved = false;
    
    const optimized = paragraphs.map(paragraph => {
      if (paragraph.split(' ').length > 150) {
        // Break long paragraphs at natural break points
        const sentences = paragraph.split(/(?<=[.!?])\s+/);
        const midpoint = Math.floor(sentences.length / 2);
        improved = true;
        return sentences.slice(0, midpoint).join(' ') + '\n\n' + sentences.slice(midpoint).join(' ');
      }
      return paragraph;
    }).join('\n\n');
    
    return { improved, optimized };
  }

  optimizeSentences(body) {
    // This is a simplified implementation
    // In a full version, this would use NLP to improve sentence structure
    return { improved: false, optimized: body };
  }

  addTransitionWords(body) {
    // This is a simplified implementation
    // In a full version, this would intelligently add transition words
    return { improved: false, optimized: body };
  }

  // Utility Methods
  extractBenefits(body) {
    const benefitPatterns = [
      /benefits?\s+include/gi,
      /advantages?\s+of/gi,
      /features?\s+include/gi
    ];
    
    const benefits = [];
    benefitPatterns.forEach(pattern => {
      const matches = body.match(pattern);
      if (matches) {
        // Extract text following the pattern
        const index = body.search(pattern);
        const following = body.substring(index, index + 200);
        benefits.push(following.split('.')[0]);
      }
    });
    
    return benefits;
  }

  parseMdFile(content) {
    const parts = content.split('---');
    if (parts.length < 3) {
      return { frontmatter: {}, body: content };
    }
    
    const frontmatterText = parts[1];
    const body = parts.slice(2).join('---');
    
    // Parse YAML frontmatter (simplified)
    const frontmatter = {};
    frontmatterText.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
        frontmatter[key] = value;
      }
    });
    
    return { frontmatter, body: body.trim() };
  }

  reconstructMdFile(frontmatter, body) {
    let content = '---\n';
    
    Object.entries(frontmatter).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        content += `${key}:\n`;
        value.forEach(item => content += `  - ${item}\n`);
      } else {
        content += `${key}: ${value}\n`;
      }
    });
    
    content += '---\n\n' + body;
    return content;
  }

  // Backup and Rollback Methods
  createBackup(filePath) {
    const backupPath = filePath + '.backup-' + Date.now();
    fs.copyFileSync(filePath, backupPath);
    return backupPath;
  }

  rollbackFromBackup(filePath, backupPath) {
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, filePath);
      fs.unlinkSync(backupPath);
      console.log('✅ Rolled back to original content');
    }
  }

  removeBackup(backupPath) {
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
    }
  }

  // Safety Checks and Human Approval Gates
  performSafetyChecks(filePath, options) {
    const checks = [];
    
    // Check 1: File exists and is readable
    if (!fs.existsSync(filePath)) {
      return { safe: false, reason: 'File does not exist' };
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check 2: File is not empty
      if (content.trim().length < 100) {
        return { safe: false, reason: 'File too small for safe optimization (< 100 chars)' };
      }

      // Check 3: File appears to be markdown blog post
      if (!content.includes('---') || !content.includes('title:')) {
        return { safe: false, reason: 'File does not appear to be a valid markdown blog post' };
      }

      // Check 4: File is not already being optimized (check for backup)
      const existingBackups = fs.readdirSync(path.dirname(filePath))
        .filter(file => file.startsWith(path.basename(filePath) + '.backup-'));
      
      if (existingBackups.length > 3) {
        return { safe: false, reason: 'Too many backup files - possible optimization loop' };
      }

      // Check 5: File hasn't been modified very recently (avoid conflicts)
      const stats = fs.statSync(filePath);
      const timeSinceModified = Date.now() - stats.mtime.getTime();
      if (timeSinceModified < 30000 && !options.force) { // 30 seconds
        return { safe: false, reason: 'File was modified very recently - wait before optimizing' };
      }

      // Check 6: File size is reasonable (not too large)
      if (content.length > 50000) { // 50KB
        return { safe: false, reason: 'File too large for safe optimization (> 50KB)' };
      }

      // Check 7: No suspicious content patterns
      const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /onclick=/i,
        /document\./i,
        /eval\(/i
      ];

      for (const pattern of suspiciousPatterns) {
        if (pattern.test(content)) {
          return { safe: false, reason: 'File contains suspicious content patterns' };
        }
      }

    } catch (error) {
      return { safe: false, reason: `Cannot read file: ${error.message}` };
    }

    return { safe: true, checks };
  }

  requiresHumanApproval(analysis) {
    // Require approval for very low scores that need major changes
    if (analysis.overall < 30) {
      return true;
    }

    // Require approval if many critical components are failing
    const criticalScores = [
      analysis.scores.title?.score || 0,
      analysis.scores.description?.score || 0,
      analysis.scores.content?.score || 0
    ];

    const failingCritical = criticalScores.filter(score => score < 40).length;
    if (failingCritical >= 2) {
      return true;
    }

    // Require approval if content is very short (might need major expansion)
    if (analysis.scores.content?.data?.wordCount < 500) {
      return true;
    }

    return false;
  }

  // Content Quality Validation
  validateOptimizedContent(originalContent, optimizedContent, originalAnalysis, finalAnalysis) {
    const validation = {
      safe: true,
      warnings: [],
      errors: []
    };

    // Check 1: Content didn't become significantly shorter
    const originalLength = originalContent.length;
    const optimizedLength = optimizedContent.length;
    const lengthChange = (optimizedLength - originalLength) / originalLength;

    if (lengthChange < -0.3) { // 30% shorter
      validation.errors.push('Content became significantly shorter (> 30% reduction)');
      validation.safe = false;
    } else if (lengthChange < -0.1) { // 10% shorter
      validation.warnings.push('Content became noticeably shorter (> 10% reduction)');
    }

    // Check 2: Score didn't decrease
    if (finalAnalysis.overall < originalAnalysis.overall) {
      validation.errors.push(`SEO score decreased: ${originalAnalysis.overall} → ${finalAnalysis.overall}`);
      validation.safe = false;
    }

    // Check 3: No suspicious content was added
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /onclick=/i,
      /document\./i,
      /eval\(/i
    ];

    for (const pattern of suspiciousPatterns) {
      if (!pattern.test(originalContent) && pattern.test(optimizedContent)) {
        validation.errors.push('Suspicious content was added during optimization');
        validation.safe = false;
      }
    }

    // Check 4: Core content structure preserved
    const originalHeadings = (originalContent.match(/^#{1,6}\s+.*/gm) || []).length;
    const optimizedHeadings = (optimizedContent.match(/^#{1,6}\s+.*/gm) || []).length;
    
    if (optimizedHeadings < originalHeadings * 0.5) {
      validation.warnings.push('Many headings were removed during optimization');
    }

    // Check 5: No critical frontmatter was lost
    const originalFrontmatter = this.parseMdFile(originalContent).frontmatter;
    const optimizedFrontmatter = this.parseMdFile(optimizedContent).frontmatter;

    const criticalFields = ['title', 'publishDate', 'author'];
    for (const field of criticalFields) {
      if (originalFrontmatter[field] && !optimizedFrontmatter[field]) {
        validation.errors.push(`Critical frontmatter field '${field}' was lost`);
        validation.safe = false;
      }
    }

    return validation;
  }

  // Emergency Rollback System
  createEmergencyRollback(filePath, backupPath, reason) {
    try {
      const rollbackInfo = {
        timestamp: new Date().toISOString(),
        originalFile: filePath,
        backupFile: backupPath,
        reason: reason,
        rollbackCommands: [
          `cp "${backupPath}" "${filePath}"`,
          `echo "Rolled back due to: ${reason}"`
        ]
      };

      const rollbackScript = path.join(path.dirname(filePath), '.seo-rollback.json');
      fs.writeFileSync(rollbackScript, JSON.stringify(rollbackInfo, null, 2));
      
      console.log(`💾 Emergency rollback info saved: ${rollbackScript}`);
      return rollbackScript;
    } catch (error) {
      console.error('⚠️ Failed to create rollback info:', error.message);
      return null;
    }
  }

  // Quality Gates
  passesQualityGates(analysis, options = {}) {
    const gates = [];

    // Gate 1: Minimum score improvement
    const minImprovement = options.minImprovement || 5;
    if (analysis.improvement < minImprovement) {
      gates.push({
        passed: false,
        gate: 'minimum_improvement',
        message: `Improvement ${analysis.improvement} below minimum ${minImprovement}`
      });
    }

    // Gate 2: No critical component failures
    const criticalComponents = ['title', 'description', 'content'];
    const failedComponents = criticalComponents.filter(comp => 
      analysis.scores[comp] && analysis.scores[comp].score < 50
    );

    if (failedComponents.length > 0) {
      gates.push({
        passed: false,
        gate: 'critical_components',
        message: `Critical components still failing: ${failedComponents.join(', ')}`
      });
    }

    // Gate 3: Readability within acceptable range
    if (analysis.scores.readability && analysis.scores.readability.score < 40) {
      gates.push({
        passed: false,
        gate: 'readability',
        message: 'Content readability is too low for target audience'
      });
    }

    const passedGates = gates.filter(g => g.passed !== false).length;
    const totalGates = gates.length;

    return {
      passed: gates.every(g => g.passed !== false),
      gates: gates,
      summary: `${passedGates}/${totalGates} quality gates passed`
    };
  }
}

export default SEOOptimizer;