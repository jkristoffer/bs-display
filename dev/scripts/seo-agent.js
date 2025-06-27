#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SEOAgent {
  constructor() {
    this.contentDir = path.join(__dirname, '../src/content/blog');
    this.analysisCache = new Map();
    this.industryKeywords = [
      'interactive display', 'smartboard', 'whiteboard', 'touch screen',
      'digital display', 'collaboration', 'presentation', 'meeting room',
      'classroom', 'education', 'business', 'technology', 'LED', 'LCD',
      'OLED', 'capacitive', 'infrared', 'electromagnetic', '4K', '8K'
    ];
    this.competitorAnalysis = this.loadCompetitorData();
  }

  // Advanced SEO Analysis Engine
  async analyzeBlogPost(filePath, options = {}) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const analysis = {
        file: path.basename(filePath),
        timestamp: new Date().toISOString(),
        scores: {},
        recommendations: [],
        warnings: [],
        passes: [],
        overall: 0
      };

      // Parse frontmatter and content
      const { frontmatter, body } = this.parseMdFile(content);
      
      // Core SEO Analysis Components
      try {
        analysis.scores.title = this.analyzeTitleSEO(frontmatter.title, body);
      } catch (e) { 
        console.warn(`Title analysis failed for ${path.basename(filePath)}:`, e.message);
        analysis.scores.title = { score: 0, issues: [], suggestions: [], data: {} };
      }
      
      try {
        analysis.scores.description = this.analyzeMetaDescription(frontmatter.description);
      } catch (e) { 
        console.warn(`Description analysis failed for ${path.basename(filePath)}:`, e.message);
        analysis.scores.description = { score: 0, issues: [], suggestions: [], data: {} };
      }
      
      try {
        analysis.scores.keywords = this.analyzeKeywords(frontmatter, body);
      } catch (e) { 
        console.warn(`Keywords analysis failed for ${path.basename(filePath)}:`, e.message);
        analysis.scores.keywords = { score: 0, issues: [], suggestions: [], data: {} };
      }
      
      try {
        analysis.scores.content = this.analyzeContentQuality(body);
      } catch (e) { 
        console.warn(`Content analysis failed for ${path.basename(filePath)}:`, e.message);
        analysis.scores.content = { score: 0, issues: [], suggestions: [], data: {} };
      }
      
      try {
        analysis.scores.structure = this.analyzeContentStructure(body);
      } catch (e) { 
        console.warn(`Structure analysis failed for ${path.basename(filePath)}:`, e.message);
        analysis.scores.structure = { score: 0, issues: [], suggestions: [], data: {} };
      }
      
      try {
        analysis.scores.readability = this.analyzeReadability(body);
      } catch (e) { 
        console.warn(`Readability analysis failed for ${path.basename(filePath)}:`, e.message);
        analysis.scores.readability = { score: 0, issues: [], suggestions: [], data: {} };
      }
      
      try {
        analysis.scores.links = this.analyzeLinkProfile(body);
      } catch (e) { 
        console.warn(`Links analysis failed for ${path.basename(filePath)}:`, e.message);
        analysis.scores.links = { score: 0, issues: [], suggestions: [], data: {} };
      }
      
      try {
        analysis.scores.technical = this.analyzeTechnicalSEO(frontmatter, body);
      } catch (e) { 
        console.warn(`Technical analysis failed for ${path.basename(filePath)}:`, e.message);
        analysis.scores.technical = { score: 0, issues: [], suggestions: [], data: {} };
      }
      
      try {
        analysis.scores.competition = this.analyzeCompetitivePosition(frontmatter, body);
      } catch (e) { 
        console.warn(`Competition analysis failed for ${path.basename(filePath)}:`, e.message);
        analysis.scores.competition = { score: 0, issues: [], suggestions: [], data: {} };
      }
      
      try {
        analysis.scores.featuredSnippets = this.analyzeFeaturedSnippets(frontmatter, body);
      } catch (e) { 
        console.warn(`Featured Snippets analysis failed for ${path.basename(filePath)}:`, e.message);
        analysis.scores.featuredSnippets = { score: 0, issues: [], suggestions: [], data: {} };
      }
      
      try {
        analysis.scores.schemaMarkup = this.analyzeSchemaMarkup(frontmatter, body);
      } catch (e) { 
        console.warn(`Schema Markup analysis failed for ${path.basename(filePath)}:`, e.message);
        analysis.scores.schemaMarkup = { score: 0, issues: [], suggestions: [], data: {} };
      }

      // Calculate overall score
      analysis.overall = this.calculateOverallScore(analysis.scores) || 0;
      
      // Generate recommendations (with fallback to empty arrays)
      analysis.recommendations = this.generateRecommendations(analysis.scores, frontmatter, body) || [];
      analysis.warnings = this.generateWarnings(analysis.scores, frontmatter, body) || [];
      analysis.passes = this.generatePasses(analysis.scores) || [];

      // Cache analysis for performance
      this.analysisCache.set(filePath, analysis);
      
      return analysis;
    } catch (error) {
      console.error(`❌ Failed to analyze ${path.basename(filePath)}:`, error.message);
      // Return a minimal analysis object to prevent further errors
      return {
        file: path.basename(filePath),
        timestamp: new Date().toISOString(),
        scores: {},
        recommendations: [],
        warnings: [`Analysis failed: ${error.message}`],
        passes: [],
        overall: 0
      };
    }
  }

  // Title SEO Analysis
  analyzeTitleSEO(title, body) {
    const analysis = {
      score: 0,
      issues: [],
      suggestions: [],
      data: {}
    };

    if (!title) {
      analysis.issues.push('No title found');
      return analysis;
    }

    analysis.data.length = title.length;
    analysis.data.wordCount = title.split(' ').length;
    analysis.data.hasNumbers = /\d/.test(title);
    analysis.data.hasYear = /20\d{2}/.test(title);
    analysis.data.powerWords = this.findPowerWords(title);
    analysis.data.industryKeywords = this.findIndustryKeywords(title);

    // Length optimization (50-60 chars is ideal)
    if (title.length >= 50 && title.length <= 60) {
      analysis.score += 25;
    } else if (title.length >= 40 && title.length <= 70) {
      analysis.score += 15;
      analysis.suggestions.push(`Title length (${title.length}) is okay but optimal is 50-60 characters`);
    } else {
      analysis.issues.push(`Title length (${title.length}) is outside optimal range (50-60 characters)`);
    }

    // Keyword placement (primary keyword should be early)
    const primaryKeyword = this.extractPrimaryKeyword(title, body);
    if (primaryKeyword && title.toLowerCase().indexOf(primaryKeyword.toLowerCase()) <= 30) {
      analysis.score += 20;
      analysis.data.primaryKeywordPosition = title.toLowerCase().indexOf(primaryKeyword.toLowerCase());
    } else {
      analysis.suggestions.push('Consider moving primary keyword earlier in title');
    }

    // Power words and engagement
    if (analysis.data.powerWords.length > 0) {
      analysis.score += 15;
      analysis.data.powerWordsFound = analysis.data.powerWords;
    } else {
      analysis.suggestions.push('Consider adding power words (Complete, Ultimate, Professional, Advanced)');
    }

    // Year inclusion for evergreen content
    if (analysis.data.hasYear) {
      analysis.score += 10;
    } else {
      analysis.suggestions.push('Consider adding current year for freshness (2025)');
    }

    // Industry keyword relevance
    if (analysis.data.industryKeywords.length >= 2) {
      analysis.score += 20;
    } else if (analysis.data.industryKeywords.length === 1) {
      analysis.score += 10;
      analysis.suggestions.push('Consider adding more industry-specific keywords');
    } else {
      analysis.issues.push('No industry keywords found in title');
    }

    // Readability and clickability
    if (title.includes(':') || title.includes('|')) {
      analysis.score += 10;
    } else {
      analysis.suggestions.push('Consider using colons or pipes for better structure');
    }

    return analysis;
  }

  // Meta Description Analysis
  analyzeMetaDescription(description) {
    const analysis = {
      score: 0,
      issues: [],
      suggestions: [],
      data: {}
    };

    if (!description) {
      analysis.issues.push('No meta description found');
      return analysis;
    }

    analysis.data.length = description.length;
    analysis.data.wordCount = description.split(' ').length;
    analysis.data.hasCallToAction = this.hasCallToAction(description);
    analysis.data.industryKeywords = this.findIndustryKeywords(description);
    analysis.data.emotionalWords = this.findEmotionalWords(description);

    // Length optimization (150-160 chars is ideal)
    if (description.length >= 150 && description.length <= 160) {
      analysis.score += 30;
    } else if (description.length >= 140 && description.length <= 170) {
      analysis.score += 20;
      analysis.suggestions.push(`Description length (${description.length}) is close to optimal (150-160)`);
    } else {
      analysis.issues.push(`Description length (${description.length}) is outside optimal range (150-160 characters)`);
    }

    // Keyword inclusion
    if (analysis.data.industryKeywords.length >= 2) {
      analysis.score += 25;
    } else if (analysis.data.industryKeywords.length === 1) {
      analysis.score += 15;
      analysis.suggestions.push('Consider adding more relevant keywords');
    } else {
      analysis.issues.push('No industry keywords found in description');
    }

    // Call to action
    if (analysis.data.hasCallToAction) {
      analysis.score += 20;
    } else {
      analysis.suggestions.push('Consider adding a call-to-action (learn, discover, find, compare)');
    }

    // Emotional engagement
    if (analysis.data.emotionalWords.length > 0) {
      analysis.score += 15;
    } else {
      analysis.suggestions.push('Consider adding emotional words to increase click-through rates');
    }

    // Uniqueness and value proposition
    if (description.includes('2025') || description.includes('guide') || description.includes('complete')) {
      analysis.score += 10;
    }

    return analysis;
  }

  // Keyword Analysis
  analyzeKeywords(frontmatter, body) {
    const analysis = {
      score: 0,
      issues: [],
      suggestions: [],
      data: {}
    };

    const keywords = frontmatter.keywords || [];
    const textContent = body.toLowerCase();
    
    analysis.data.keywordCount = keywords.length;
    analysis.data.keywordDensity = {};
    analysis.data.keywordPlacement = {};
    analysis.data.semanticKeywords = this.findSemanticKeywords(body);
    analysis.data.longTailKeywords = this.findLongTailKeywords(body);

    // Keyword count optimization
    if (keywords.length >= 3 && keywords.length <= 7) {
      analysis.score += 20;
    } else if (keywords.length > 0) {
      analysis.score += 10;
      analysis.suggestions.push(`Consider ${keywords.length < 3 ? 'adding more' : 'reducing'} keywords (optimal: 3-7)`);
    } else {
      analysis.issues.push('No keywords defined in frontmatter');
    }

    // Keyword density analysis
    keywords.forEach(keyword => {
      const keywordRegex = new RegExp(keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const matches = (textContent.match(keywordRegex) || []).length;
      const wordCount = body.split(/\s+/).length;
      const density = (matches / wordCount) * 100;
      
      analysis.data.keywordDensity[keyword] = {
        count: matches,
        density: density.toFixed(2)
      };

      // Optimal keyword density is 1-3%
      if (density >= 1 && density <= 3) {
        analysis.score += 5;
      } else if (density > 0) {
        if (density < 1) {
          analysis.suggestions.push(`Keyword "${keyword}" density (${density.toFixed(1)}%) is low, consider adding more mentions`);
        } else {
          analysis.issues.push(`Keyword "${keyword}" density (${density.toFixed(1)}%) is high, risk of keyword stuffing`);
        }
      }
    });

    // Keyword placement in headings
    const headings = this.extractHeadings(body);
    keywords.forEach(keyword => {
      const keywordInHeadings = headings.some(heading => 
        heading.text.toLowerCase().includes(keyword.toLowerCase())
      );
      if (keywordInHeadings) {
        analysis.score += 5;
      } else {
        analysis.suggestions.push(`Consider including "${keyword}" in headings`);
      }
    });

    // Semantic keyword coverage
    if (analysis.data.semanticKeywords.length >= 5) {
      analysis.score += 15;
    } else {
      analysis.suggestions.push('Consider adding more semantic keywords for topic coverage');
    }

    // Long-tail keyword opportunities
    if (analysis.data.longTailKeywords.length >= 3) {
      analysis.score += 10;
    } else {
      analysis.suggestions.push('Consider targeting more long-tail keyword phrases');
    }

    return analysis;
  }

  // Content Quality Analysis
  analyzeContentQuality(body) {
    const analysis = {
      score: 0,
      issues: [],
      suggestions: [],
      data: {}
    };

    const wordCount = body.split(/\s+/).length;
    const paragraphs = body.split('\n\n').filter(p => p.trim().length > 0);
    const sentences = body.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    analysis.data.wordCount = wordCount;
    analysis.data.paragraphCount = paragraphs.length;
    analysis.data.sentenceCount = sentences.length;
    analysis.data.averageWordsPerSentence = wordCount / sentences.length;
    analysis.data.averageWordsPerParagraph = wordCount / paragraphs.length;
    analysis.data.uniqueWords = this.countUniqueWords(body);
    analysis.data.contentDepthScore = this.calculateContentDepth(body);

    // Word count optimization (1500-3000 words for comprehensive content)
    if (wordCount >= 1500 && wordCount <= 3000) {
      analysis.score += 25;
    } else if (wordCount >= 1000 && wordCount <= 4000) {
      analysis.score += 15;
      analysis.suggestions.push(`Word count (${wordCount}) is acceptable but optimal range is 1500-3000`);
    } else {
      analysis.issues.push(`Word count (${wordCount}) is outside optimal range (1500-3000 words)`);
    }

    // Content structure
    if (analysis.data.averageWordsPerSentence >= 15 && analysis.data.averageWordsPerSentence <= 25) {
      analysis.score += 15;
    } else {
      analysis.suggestions.push('Optimize sentence length for readability (15-25 words average)');
    }

    // Paragraph structure
    if (analysis.data.averageWordsPerParagraph >= 50 && analysis.data.averageWordsPerParagraph <= 150) {
      analysis.score += 10;
    } else {
      analysis.suggestions.push('Optimize paragraph length (50-150 words average)');
    }

    // Vocabulary diversity
    const vocabularyRatio = analysis.data.uniqueWords / wordCount;
    if (vocabularyRatio >= 0.5) {
      analysis.score += 15;
    } else {
      analysis.suggestions.push('Increase vocabulary diversity to avoid repetition');
    }

    // Content depth and expertise
    if (analysis.data.contentDepthScore >= 0.7) {
      analysis.score += 20;
    } else if (analysis.data.contentDepthScore >= 0.5) {
      analysis.score += 10;
      analysis.suggestions.push('Consider adding more detailed explanations and examples');
    } else {
      analysis.issues.push('Content lacks sufficient depth and expertise');
    }

    // Engagement factors
    const hasQuestions = /\?/.test(body);
    const hasLists = /^\s*[-*+]\s/.test(body) || /^\s*\d+\.\s/.test(body);
    const hasExamples = /example|instance|case|scenario/i.test(body);
    
    if (hasQuestions) analysis.score += 5;
    if (hasLists) analysis.score += 5;
    if (hasExamples) analysis.score += 5;

    return analysis;
  }

  // Content Structure Analysis
  analyzeContentStructure(body) {
    const analysis = {
      score: 0,
      issues: [],
      suggestions: [],
      data: {}
    };

    const headings = this.extractHeadings(body);
    analysis.data.headings = headings;
    analysis.data.h1Count = headings.filter(h => h.level === 1).length;
    analysis.data.h2Count = headings.filter(h => h.level === 2).length;
    analysis.data.h3Count = headings.filter(h => h.level === 3).length;
    analysis.data.hasTableOfContents = this.hasTableOfContents(body);
    analysis.data.hasConclusion = this.hasConclusion(body);
    analysis.data.hasIntroduction = this.hasIntroduction(body);

    // Heading hierarchy
    if (analysis.data.h1Count === 0) { // Title is H1 in frontmatter
      analysis.score += 10;
    } else if (analysis.data.h1Count === 1) {
      analysis.score += 5;
      analysis.suggestions.push('Consider if H1 in content is necessary (title already serves as H1)');
    } else {
      analysis.issues.push('Multiple H1 tags found - should only have one per page');
    }

    // H2 structure (main sections)
    if (analysis.data.h2Count >= 4 && analysis.data.h2Count <= 8) {
      analysis.score += 20;
    } else if (analysis.data.h2Count >= 2) {
      analysis.score += 10;
      analysis.suggestions.push('Consider optimizing number of main sections (4-8 H2s optimal)');
    } else {
      analysis.issues.push('Insufficient heading structure - add more H2 sections');
    }

    // H3 subsections
    if (analysis.data.h3Count > 0) {
      analysis.score += 10;
    } else {
      analysis.suggestions.push('Consider adding H3 subsections for better content organization');
    }

    // Content organization elements
    if (analysis.data.hasIntroduction) {
      analysis.score += 15;
    } else {
      analysis.suggestions.push('Add clear introduction section');
    }

    if (analysis.data.hasConclusion) {
      analysis.score += 15;
    } else {
      analysis.suggestions.push('Add conclusion section to summarize key points');
    }

    // Heading keyword optimization
    const keywordInHeadings = headings.filter(h => 
      this.industryKeywords.some(keyword => 
        h.text.toLowerCase().includes(keyword)
      )
    ).length;
    
    if (keywordInHeadings >= headings.length * 0.5) {
      analysis.score += 15;
    } else {
      analysis.suggestions.push('Include more industry keywords in headings');
    }

    // Heading length optimization
    const optimalHeadingLengths = headings.filter(h => 
      h.text.length >= 20 && h.text.length <= 70
    ).length;
    
    if (optimalHeadingLengths >= headings.length * 0.7) {
      analysis.score += 10;
    } else {
      analysis.suggestions.push('Optimize heading lengths (20-70 characters)');
    }

    return analysis;
  }

  // Readability Analysis
  analyzeReadability(body) {
    const analysis = {
      score: 0,
      issues: [],
      suggestions: [],
      data: {}
    };

    const sentences = body.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = body.split(/\s+/).filter(w => w.length > 0);
    const syllables = words.reduce((count, word) => count + this.countSyllables(word), 0);
    
    // Flesch Reading Ease Score
    const avgSentenceLength = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;
    const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    
    analysis.data.fleschScore = Math.round(fleschScore);
    analysis.data.avgSentenceLength = Math.round(avgSentenceLength);
    analysis.data.avgSyllablesPerWord = avgSyllablesPerWord.toFixed(2);
    analysis.data.readingLevel = this.getReadingLevel(fleschScore);
    
    // Complex words analysis
    const complexWords = words.filter(word => this.countSyllables(word) >= 3);
    analysis.data.complexWordRatio = (complexWords.length / words.length * 100).toFixed(1);
    
    // Transition words
    const transitionWords = this.findTransitionWords(body);
    analysis.data.transitionWordCount = transitionWords.length;
    analysis.data.transitionWordRatio = (transitionWords.length / sentences.length * 100).toFixed(1);

    // Scoring based on readability
    if (fleschScore >= 60 && fleschScore <= 80) {
      analysis.score += 30; // 9th-10th grade level (optimal for web)
    } else if (fleschScore >= 50 && fleschScore <= 90) {
      analysis.score += 20;
      analysis.suggestions.push(`Reading level (${analysis.data.readingLevel}) could be optimized for web content`);
    } else {
      analysis.issues.push(`Reading level (${analysis.data.readingLevel}) may be too difficult for target audience`);
    }

    // Sentence length variety
    const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
    const sentenceLengthVariety = this.calculateVariety(sentenceLengths);
    if (sentenceLengthVariety >= 0.3) {
      analysis.score += 15;
    } else {
      analysis.suggestions.push('Vary sentence lengths for better readability');
    }

    // Complex word ratio
    if (parseFloat(analysis.data.complexWordRatio) <= 15) {
      analysis.score += 15;
    } else {
      analysis.suggestions.push('Consider simplifying complex words where possible');
    }

    // Transition words
    if (parseFloat(analysis.data.transitionWordRatio) >= 20) {
      analysis.score += 10;
    } else {
      analysis.suggestions.push('Add more transition words to improve flow');
    }

    // Passive voice detection
    const passiveVoiceCount = this.countPassiveVoice(body);
    analysis.data.passiveVoiceRatio = (passiveVoiceCount / sentences.length * 100).toFixed(1);
    
    if (parseFloat(analysis.data.passiveVoiceRatio) <= 10) {
      analysis.score += 10;
    } else {
      analysis.suggestions.push('Reduce passive voice usage for more engaging content');
    }

    return analysis;
  }

  // Link Profile Analysis
  analyzeLinkProfile(body) {
    const analysis = {
      score: 0,
      issues: [],
      suggestions: [],
      data: {}
    };

    const internalLinks = this.extractLinks(body, 'internal');
    const externalLinks = this.extractLinks(body, 'external');
    const wordCount = body.split(/\s+/).length;
    
    analysis.data.internalLinkCount = internalLinks.length;
    analysis.data.externalLinkCount = externalLinks.length;
    analysis.data.totalLinks = internalLinks.length + externalLinks.length;
    analysis.data.linkDensity = (analysis.data.totalLinks / wordCount * 100).toFixed(2);
    analysis.data.internalLinks = internalLinks;
    analysis.data.externalLinks = externalLinks;

    // Internal linking (crucial for SEO)
    if (internalLinks.length >= 3 && internalLinks.length <= 8) {
      analysis.score += 25;
    } else if (internalLinks.length > 0) {
      analysis.score += 10;
      analysis.suggestions.push(`Optimize internal links (current: ${internalLinks.length}, optimal: 3-8)`);
    } else {
      analysis.issues.push('No internal links found - add links to related content');
    }

    // External links for authority
    if (externalLinks.length >= 1 && externalLinks.length <= 3) {
      analysis.score += 15;
    } else if (externalLinks.length === 0) {
      analysis.suggestions.push('Consider adding 1-2 external links to authoritative sources');
    } else {
      analysis.suggestions.push('Too many external links may dilute link equity');
    }

    // Link density optimization
    const linkDensityNum = parseFloat(analysis.data.linkDensity);
    if (linkDensityNum >= 1 && linkDensityNum <= 3) {
      analysis.score += 15;
    } else {
      analysis.suggestions.push(`Link density (${analysis.data.linkDensity}%) should be 1-3% of content`);
    }

    // Anchor text optimization
    const anchorTextAnalysis = this.analyzeAnchorText([...internalLinks, ...externalLinks]);
    analysis.data.anchorTextOptimization = anchorTextAnalysis;
    
    if (anchorTextAnalysis.descriptiveRatio >= 0.7) {
      analysis.score += 10;
    } else {
      analysis.suggestions.push('Use more descriptive anchor text instead of generic phrases');
    }

    // Link distribution
    const linkDistribution = this.analyzeLinkDistribution(body, [...internalLinks, ...externalLinks]);
    if (linkDistribution.wellDistributed) {
      analysis.score += 10;
    } else {
      analysis.suggestions.push('Distribute links more evenly throughout content');
    }

    return analysis;
  }

  // Technical SEO Analysis
  analyzeTechnicalSEO(frontmatter, body) {
    const analysis = {
      score: 0,
      issues: [],
      suggestions: [],
      data: {}
    };

    // Frontmatter completeness
    const requiredFields = ['title', 'description', 'publishDate', 'author', 'category', 'keywords'];
    const missingFields = requiredFields.filter(field => !frontmatter[field]);
    
    analysis.data.frontmatterCompleteness = (requiredFields.length - missingFields.length) / requiredFields.length;
    
    if (missingFields.length === 0) {
      analysis.score += 20;
    } else {
      analysis.issues.push(`Missing frontmatter fields: ${missingFields.join(', ')}`);
    }

    // Schema markup opportunities
    analysis.data.schemaOpportunities = this.identifySchemaOpportunities(frontmatter, body);
    if (analysis.data.schemaOpportunities.length > 0) {
      analysis.suggestions.push(`Consider adding schema markup: ${analysis.data.schemaOpportunities.join(', ')}`);
    }

    // Image optimization
    const images = this.extractImages(body);
    analysis.data.imageCount = images.length;
    analysis.data.imagesWithAlt = images.filter(img => img.alt && img.alt.trim().length > 0).length;
    
    if (images.length > 0) {
      const altTextRatio = analysis.data.imagesWithAlt / images.length;
      if (altTextRatio === 1) {
        analysis.score += 15;
      } else {
        analysis.issues.push(`${images.length - analysis.data.imagesWithAlt} images missing alt text`);
      }
    }

    // URL/filename optimization
    const filename = frontmatter.slug || 'untitled';
    analysis.data.urlOptimization = this.analyzeUrlOptimization(filename);
    if (analysis.data.urlOptimization.score >= 0.8) {
      analysis.score += 10;
    } else {
      analysis.suggestions.push('Optimize URL structure with relevant keywords');
    }

    // Content freshness
    const publishDate = new Date(frontmatter.publishDate);
    const currentDate = new Date();
    const daysSincePublish = (currentDate - publishDate) / (1000 * 60 * 60 * 24);
    
    analysis.data.daysSincePublish = Math.round(daysSincePublish);
    analysis.data.contentFreshness = daysSincePublish < 365 ? 'fresh' : 'aging';
    
    if (daysSincePublish < 90) {
      analysis.score += 15;
    } else if (daysSincePublish < 365) {
      analysis.score += 10;
    } else {
      analysis.suggestions.push('Consider updating content to maintain freshness');
    }

    // Mobile optimization indicators
    const mobileOptimization = this.analyzeMobileOptimization(body);
    analysis.data.mobileOptimization = mobileOptimization;
    if (mobileOptimization.score >= 0.8) {
      analysis.score += 10;
    } else {
      analysis.suggestions.push('Optimize content structure for mobile reading');
    }

    return analysis;
  }

  // Competitive Analysis
  analyzeCompetitivePosition(frontmatter, body) {
    const analysis = {
      score: 0,
      issues: [],
      suggestions: [],
      data: {}
    };

    const contentKeywords = this.extractContentKeywords(body);
    analysis.data.topicCoverage = this.analyzeTopicCoverage(contentKeywords);
    analysis.data.uniqueAngle = this.identifyUniqueAngle(frontmatter, body);
    analysis.data.competitorGaps = this.identifyCompetitorGaps(contentKeywords);
    
    // Topic coverage depth
    if (analysis.data.topicCoverage >= 0.8) {
      analysis.score += 20;
    } else if (analysis.data.topicCoverage >= 0.6) {
      analysis.score += 10;
      analysis.suggestions.push('Expand topic coverage to outperform competitors');
    } else {
      analysis.issues.push('Insufficient topic coverage compared to competitors');
    }

    // Unique value proposition
    if (analysis.data.uniqueAngle.strength >= 0.7) {
      analysis.score += 15;
    } else {
      analysis.suggestions.push('Strengthen unique angle: ' + analysis.data.uniqueAngle.suggestions.join(', '));
    }

    // Content gaps exploitation
    if (analysis.data.competitorGaps.length > 0) {
      analysis.score += 15;
      analysis.suggestions.push('Leverage content gaps: ' + analysis.data.competitorGaps.join(', '));
    }

    // Industry authority signals
    const authoritySignals = this.identifyAuthoritySignals(body);
    analysis.data.authoritySignals = authoritySignals;
    if (authoritySignals.length >= 3) {
      analysis.score += 10;
    } else {
      analysis.suggestions.push('Add more authority signals (statistics, expert quotes, case studies)');
    }

    return analysis;
  }

  // Featured Snippets Analysis
  analyzeFeaturedSnippets(frontmatter, body) {
    const analysis = {
      score: 0,
      issues: [],
      suggestions: [],
      data: {}
    };

    // Extract content patterns
    const paragraphSnippets = this.analyzeParagraphSnippets(body);
    const listSnippets = this.analyzeListSnippets(body);
    const tableSnippets = this.analyzeTableSnippets(body);
    const faqSnippets = this.analyzeFAQSnippets(body);
    const howToSnippets = this.analyzeHowToSnippets(body);
    const definitionSnippets = this.analyzeDefinitionSnippets(body);

    analysis.data = {
      paragraphSnippets,
      listSnippets,
      tableSnippets,
      faqSnippets,
      howToSnippets,
      definitionSnippets,
      totalOpportunities: 0
    };

    // Score paragraph snippets (40-60 words, direct answers)
    if (paragraphSnippets.optimized.length > 0) {
      analysis.score += 20;
      analysis.data.totalOpportunities += paragraphSnippets.optimized.length;
    } else if (paragraphSnippets.potential.length > 0) {
      analysis.score += 10;
      analysis.suggestions.push('Optimize paragraph answers to 40-60 words for snippet capture');
    } else {
      analysis.suggestions.push('Add direct answer paragraphs (40-60 words) for common questions');
    }

    // Score list snippets
    if (listSnippets.optimized.length > 0) {
      analysis.score += 15;
      analysis.data.totalOpportunities += listSnippets.optimized.length;
    } else if (listSnippets.potential.length > 0) {
      analysis.score += 8;
      analysis.suggestions.push('Format lists with clear headers and 3-8 items for snippet optimization');
    } else {
      analysis.suggestions.push('Add numbered or bulleted lists for step-by-step processes');
    }

    // Score table snippets
    if (tableSnippets.optimized.length > 0) {
      analysis.score += 15;
      analysis.data.totalOpportunities += tableSnippets.optimized.length;
    } else if (tableSnippets.potential.length > 0) {
      analysis.score += 8;
      analysis.suggestions.push('Create comparison tables with clear headers and data');
    } else {
      analysis.suggestions.push('Add comparison tables for products, features, or specifications');
    }

    // Score FAQ snippets
    if (faqSnippets.optimized.length > 0) {
      analysis.score += 20;
      analysis.data.totalOpportunities += faqSnippets.optimized.length;
    } else if (faqSnippets.potential.length > 0) {
      analysis.score += 10;
      analysis.suggestions.push('Format Q&A sections with clear question headers');
    } else {
      analysis.suggestions.push('Add FAQ section with common questions and concise answers');
    }

    // Score How-To snippets
    if (howToSnippets.optimized.length > 0) {
      analysis.score += 15;
      analysis.data.totalOpportunities += howToSnippets.optimized.length;
    } else if (howToSnippets.potential.length > 0) {
      analysis.score += 8;
      analysis.suggestions.push('Structure how-to content with numbered steps and clear instructions');
    }

    // Score definition snippets
    if (definitionSnippets.optimized.length > 0) {
      analysis.score += 10;
      analysis.data.totalOpportunities += definitionSnippets.optimized.length;
    } else if (definitionSnippets.potential.length > 0) {
      analysis.score += 5;
      analysis.suggestions.push('Add clear definitions for industry terms');
    }

    // Bonus for multiple snippet types
    const snippetTypes = [
      paragraphSnippets.optimized.length > 0,
      listSnippets.optimized.length > 0,
      tableSnippets.optimized.length > 0,
      faqSnippets.optimized.length > 0,
      howToSnippets.optimized.length > 0,
      definitionSnippets.optimized.length > 0
    ].filter(Boolean).length;

    if (snippetTypes >= 3) {
      analysis.score += 10;
    } else if (snippetTypes >= 2) {
      analysis.score += 5;
    }

    // Check for snippet-friendly patterns
    const hasQuestionKeywords = this.hasQuestionKeywords(frontmatter.title || '', body);
    if (hasQuestionKeywords.score > 0) {
      analysis.score += hasQuestionKeywords.score;
      analysis.data.questionKeywords = hasQuestionKeywords.keywords;
    } else {
      analysis.suggestions.push('Include question keywords (what, how, why, when, where, which, best) in content');
    }

    return analysis;
  }

  // Schema Markup Analysis
  analyzeSchemaMarkup(frontmatter, body) {
    const analysis = {
      score: 0,
      issues: [],
      suggestions: [],
      data: {}
    };

    // Detect schema opportunities
    const schemaOpportunities = this.detectSchemaOpportunities(frontmatter, body);
    analysis.data.opportunities = schemaOpportunities;
    analysis.data.recommendedSchemas = [];
    analysis.data.prioritySchemas = [];

    // Article Schema (most common)
    if (schemaOpportunities.article.detected) {
      analysis.score += 15;
      analysis.data.recommendedSchemas.push({
        type: 'Article',
        priority: 'high',
        properties: schemaOpportunities.article.properties,
        implementation: this.generateArticleSchema(frontmatter, body)
      });
    } else {
      analysis.suggestions.push('Add Article schema markup for better content understanding');
    }

    // FAQ Schema
    if (schemaOpportunities.faq.detected) {
      analysis.score += 20;
      analysis.data.recommendedSchemas.push({
        type: 'FAQPage',
        priority: 'high',
        properties: schemaOpportunities.faq.properties,
        implementation: this.generateFAQSchema(schemaOpportunities.faq.questions)
      });
    } else if (schemaOpportunities.faq.potential.length > 0) {
      analysis.score += 5;
      analysis.suggestions.push('Format existing Q&A content as FAQ schema markup');
    } else {
      analysis.suggestions.push('Add FAQ section with schema markup for featured snippet opportunities');
    }

    // HowTo Schema
    if (schemaOpportunities.howTo.detected) {
      analysis.score += 20;
      analysis.data.recommendedSchemas.push({
        type: 'HowTo',
        priority: 'high',
        properties: schemaOpportunities.howTo.properties,
        implementation: this.generateHowToSchema(schemaOpportunities.howTo.steps)
      });
    } else if (schemaOpportunities.howTo.potential.length > 0) {
      analysis.score += 5;
      analysis.suggestions.push('Structure step-by-step content with HowTo schema markup');
    }

    // Product Schema
    if (schemaOpportunities.product.detected) {
      analysis.score += 15;
      analysis.data.recommendedSchemas.push({
        type: 'Product',
        priority: 'medium',
        properties: schemaOpportunities.product.properties,
        implementation: this.generateProductSchema(schemaOpportunities.product.details)
      });
    }

    // Review Schema
    if (schemaOpportunities.review.detected) {
      analysis.score += 15;
      analysis.data.recommendedSchemas.push({
        type: 'Review',
        priority: 'medium',
        properties: schemaOpportunities.review.properties,
        implementation: this.generateReviewSchema(schemaOpportunities.review.details)
      });
    }

    // Organization Schema
    if (schemaOpportunities.organization.detected) {
      analysis.score += 10;
      analysis.data.recommendedSchemas.push({
        type: 'Organization',
        priority: 'low',
        properties: schemaOpportunities.organization.properties,
        implementation: this.generateOrganizationSchema()
      });
    }

    // BreadcrumbList Schema
    if (schemaOpportunities.breadcrumb.detected) {
      analysis.score += 10;
      analysis.data.recommendedSchemas.push({
        type: 'BreadcrumbList',
        priority: 'medium',
        properties: schemaOpportunities.breadcrumb.properties,
        implementation: this.generateBreadcrumbSchema(frontmatter)
      });
    }

    // Video Schema
    if (schemaOpportunities.video.detected) {
      analysis.score += 15;
      analysis.data.recommendedSchemas.push({
        type: 'VideoObject',
        priority: 'high',
        properties: schemaOpportunities.video.properties,
        implementation: this.generateVideoSchema(schemaOpportunities.video.details)
      });
    }

    // LocalBusiness Schema (for location-based content)
    if (schemaOpportunities.localBusiness.detected) {
      analysis.score += 15;
      analysis.data.recommendedSchemas.push({
        type: 'LocalBusiness',
        priority: 'high',
        properties: schemaOpportunities.localBusiness.properties,
        implementation: this.generateLocalBusinessSchema(schemaOpportunities.localBusiness.details)
      });
    }

    // Priority schema recommendations
    analysis.data.prioritySchemas = analysis.data.recommendedSchemas
      .filter(schema => schema.priority === 'high')
      .sort((a, b) => this.getSchemaImportance(a.type) - this.getSchemaImportance(b.type));

    // Generate implementation guide
    if (analysis.data.recommendedSchemas.length > 0) {
      analysis.data.implementationGuide = this.generateSchemaImplementationGuide(analysis.data.recommendedSchemas);
    }

    // Scoring based on schema coverage
    const totalOpportunities = Object.values(schemaOpportunities).filter(opp => opp.detected || opp.potential?.length > 0).length;
    const implementedSchemas = analysis.data.recommendedSchemas.length;
    
    if (implementedSchemas >= 3) {
      analysis.score += 15;
    } else if (implementedSchemas >= 2) {
      analysis.score += 10;
    } else if (implementedSchemas >= 1) {
      analysis.score += 5;
    } else {
      analysis.issues.push('No suitable schema markup opportunities identified');
    }

    return analysis;
  }

  // Utility Methods
  parseMdFile(content) {
    const parts = content.split('---');
    if (parts.length < 3) {
      return { frontmatter: {}, body: content };
    }
    
    const frontmatterText = parts[1];
    const body = parts.slice(2).join('---').trim();
    
    const frontmatter = {};
    frontmatterText.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim();
        if (value.startsWith('[') && value.endsWith(']')) {
          frontmatter[key.trim()] = JSON.parse(value);
        } else {
          frontmatter[key.trim()] = value.replace(/"/g, '');
        }
      }
    });
    
    return { frontmatter, body };
  }

  extractHeadings(content) {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings = [];
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        level: match[1].length,
        text: match[2].trim(),
        id: this.slugify(match[2])
      });
    }
    
    return headings;
  }

  extractLinks(content, type = 'all') {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links = [];
    let match;
    
    while ((match = linkRegex.exec(content)) !== null) {
      const url = match[2];
      const isInternal = url.startsWith('/') || url.startsWith('#') || !url.includes('://');
      
      if (type === 'all' || (type === 'internal' && isInternal) || (type === 'external' && !isInternal)) {
        links.push({
          text: match[1],
          url: url,
          type: isInternal ? 'internal' : 'external'
        });
      }
    }
    
    return links;
  }

  extractImages(content) {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const images = [];
    let match;
    
    while ((match = imageRegex.exec(content)) !== null) {
      images.push({
        alt: match[1],
        src: match[2]
      });
    }
    
    return images;
  }

  findIndustryKeywords(text) {
    return this.industryKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  findPowerWords(text) {
    const powerWords = [
      'ultimate', 'complete', 'comprehensive', 'professional', 'advanced',
      'expert', 'proven', 'essential', 'definitive', 'exclusive', 'premium',
      'revolutionary', 'innovative', 'cutting-edge', 'state-of-the-art'
    ];
    return powerWords.filter(word => 
      text.toLowerCase().includes(word)
    );
  }

  findEmotionalWords(text) {
    const emotionalWords = [
      'amazing', 'incredible', 'outstanding', 'exceptional', 'remarkable',
      'transform', 'revolutionize', 'enhance', 'optimize', 'maximize',
      'streamline', 'simplify', 'accelerate', 'boost', 'improve'
    ];
    return emotionalWords.filter(word => 
      text.toLowerCase().includes(word)
    );
  }

  hasCallToAction(text) {
    const ctaWords = [
      'discover', 'learn', 'find', 'compare', 'explore', 'get', 'try',
      'start', 'begin', 'download', 'contact', 'schedule', 'request'
    ];
    return ctaWords.some(cta => text.toLowerCase().includes(cta));
  }

  countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }

  getReadingLevel(score) {
    if (score >= 90) return '5th grade';
    if (score >= 80) return '6th grade';
    if (score >= 70) return '7th grade';
    if (score >= 60) return '8th-9th grade';
    if (score >= 50) return '10th-12th grade';
    if (score >= 30) return 'College level';
    return 'Graduate level';
  }

  calculateOverallScore(scores) {
    const weights = {
      title: 0.18,
      description: 0.14,
      keywords: 0.14,
      content: 0.18,
      structure: 0.09,
      readability: 0.09,
      featuredSnippets: 0.08,
      schemaMarkup: 0.06,
      links: 0.02,
      technical: 0.01,
      competition: 0.01
    };
    
    let totalScore = 0;
    let totalWeight = 0;
    
    Object.entries(weights).forEach(([key, weight]) => {
      if (scores[key] && scores[key].score !== undefined) {
        totalScore += scores[key].score * weight;
        totalWeight += weight;
      }
    });
    
    return Math.round(totalScore / totalWeight);
  }

  generateRecommendations(scores, frontmatter, body) {
    const recommendations = [];
    
    try {
      Object.values(scores || {}).forEach(scoreObj => {
        if (scoreObj && Array.isArray(scoreObj.suggestions)) {
          recommendations.push(...scoreObj.suggestions);
        }
      });
      
      // Priority recommendations based on impact
      const priorityRecs = [];
      
      if (scores.title && scores.title.score < 70) {
        priorityRecs.push('🔥 PRIORITY: Optimize title for SEO and engagement');
      }
      if (scores.description && scores.description.score < 70) {
        priorityRecs.push('🔥 PRIORITY: Improve meta description for better CTR');
      }
      if (scores.content && scores.content.score < 70) {
        priorityRecs.push('🔥 PRIORITY: Enhance content depth and quality');
      }
      
      return [...priorityRecs, ...recommendations.slice(0, 10)];
    } catch (error) {
      console.error('Error generating recommendations:', error.message);
      return []; // Return empty array as fallback
    }
  }

  generateWarnings(scores, frontmatter, body) {
    const warnings = [];
    
    try {
      Object.values(scores || {}).forEach(scoreObj => {
        if (scoreObj && Array.isArray(scoreObj.issues)) {
          warnings.push(...scoreObj.issues);
        }
      });
      
      return warnings;
    } catch (error) {
      console.error('Error generating warnings:', error.message);
      return []; // Return empty array as fallback
    }
  }

  generatePasses(scores) {
    const passes = [];
    
    try {
      Object.entries(scores || {}).forEach(([category, scoreObj]) => {
        if (scoreObj && typeof scoreObj.score === 'number' && scoreObj.score >= 80) {
          passes.push(`✅ ${category.charAt(0).toUpperCase() + category.slice(1)} optimization excellent`);
        }
      });
      
      return passes;
    } catch (error) {
      console.error('Error generating passes:', error.message);
      return []; // Return empty array as fallback
    }
  }

  // Helper methods (simplified implementations)
  slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  extractPrimaryKeyword(title, body) {
    const keywords = this.findIndustryKeywords(title + ' ' + body);
    return keywords[0] || '';
  }

  findSemanticKeywords(body) {
    // Simplified semantic keyword detection
    return ['collaboration', 'presentation', 'meeting room', 'education'];
  }

  findLongTailKeywords(body) {
    // Simplified long-tail keyword detection
    return ['best interactive display', 'how to choose smartboard', 'interactive whiteboard comparison'];
  }

  countUniqueWords(text) {
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    return new Set(words).size;
  }

  calculateContentDepth(body) {
    // Simplified content depth calculation
    const technicalTerms = (body.match(/\b(technology|specification|feature|capability|performance)\b/gi) || []).length;
    const examples = (body.match(/\b(example|instance|case study|scenario)\b/gi) || []).length;
    const explanations = (body.match(/\b(how|why|what|when|where)\b/gi) || []).length;
    
    return Math.min(1, (technicalTerms + examples + explanations) / 50);
  }

  hasTableOfContents(body) {
    return /table.of.contents|toc/i.test(body);
  }

  hasConclusion(body) {
    return /## conclusion|## summary|## final thoughts/i.test(body);
  }

  hasIntroduction(body) {
    return body.split('\n\n')[0].length > 100; // First paragraph is substantial
  }

  findTransitionWords(body) {
    const transitions = ['however', 'therefore', 'furthermore', 'moreover', 'additionally', 'consequently'];
    return transitions.filter(word => body.toLowerCase().includes(word));
  }

  calculateVariety(values) {
    if (values.length < 2) return 0;
    const mean = values.reduce((a, b) => a + b) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance) / mean;
  }

  countPassiveVoice(body) {
    const passivePatterns = /\b(was|were|been|being)\s+\w+ed\b/gi;
    return (body.match(passivePatterns) || []).length;
  }

  analyzeAnchorText(links) {
    const descriptive = links.filter(link => 
      link.text.length > 10 && !['click here', 'read more', 'learn more'].includes(link.text.toLowerCase())
    );
    return {
      descriptiveRatio: descriptive.length / Math.max(links.length, 1),
      descriptiveCount: descriptive.length,
      totalCount: links.length
    };
  }

  analyzeLinkDistribution(body, links) {
    // Simplified distribution analysis
    return { wellDistributed: links.length > 0 };
  }

  identifySchemaOpportunities(frontmatter, body) {
    const opportunities = [];
    if (body.includes('FAQ') || body.includes('Q:')) opportunities.push('FAQ Schema');
    if (frontmatter.category) opportunities.push('Article Schema');
    if (body.includes('step') || body.includes('guide')) opportunities.push('HowTo Schema');
    return opportunities;
  }

  analyzeUrlOptimization(filename) {
    const hasKeywords = this.industryKeywords.some(keyword => 
      filename.toLowerCase().includes(keyword.replace(/\s+/g, '-'))
    );
    const hasHyphens = filename.includes('-');
    const isReasonableLength = filename.length >= 10 && filename.length <= 60;
    
    let score = 0;
    if (hasKeywords) score += 0.4;
    if (hasHyphens) score += 0.3;
    if (isReasonableLength) score += 0.3;
    
    return { score, hasKeywords, hasHyphens, isReasonableLength };
  }

  analyzeMobileOptimization(body) {
    const shortParagraphs = body.split('\n\n').filter(p => p.split(' ').length <= 100).length;
    const totalParagraphs = body.split('\n\n').length;
    const hasLists = /^\s*[-*+]\s/m.test(body);
    const hasSubheadings = /^##/m.test(body);
    
    let score = 0;
    if (shortParagraphs / totalParagraphs > 0.7) score += 0.4;
    if (hasLists) score += 0.3;
    if (hasSubheadings) score += 0.3;
    
    return { score, shortParagraphs, totalParagraphs, hasLists, hasSubheadings };
  }

  extractContentKeywords(body) {
    const words = body.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([word]) => word);
  }

  analyzeTopicCoverage(keywords) {
    // Simplified topic coverage analysis
    const industryTermsCovered = this.industryKeywords.filter(term => 
      keywords.some(keyword => keyword.includes(term.toLowerCase()))
    ).length;
    return industryTermsCovered / this.industryKeywords.length;
  }

  identifyUniqueAngle(frontmatter, body) {
    const uniqueFactors = [];
    if (body.includes('2025')) uniqueFactors.push('current year relevance');
    if (body.includes('case study') || body.includes('example')) uniqueFactors.push('practical examples');
    if (body.includes('comparison') || body.includes('vs')) uniqueFactors.push('comparative analysis');
    
    return {
      strength: uniqueFactors.length / 5,
      factors: uniqueFactors,
      suggestions: uniqueFactors.length < 3 ? ['Add more unique value propositions'] : []
    };
  }

  identifyCompetitorGaps(keywords) {
    // Simplified gap analysis
    const potentialGaps = ['ROI analysis', 'implementation timeline', 'cost breakdown', 'vendor comparison'];
    return potentialGaps.filter(gap => 
      !keywords.some(keyword => gap.toLowerCase().includes(keyword))
    );
  }

  identifyAuthoritySignals(body) {
    const signals = [];
    if (/\d+%|\d+\.\d+%/.test(body)) signals.push('statistics');
    if (/study|research|report/i.test(body)) signals.push('research citations');
    if (/expert|professional|industry leader/i.test(body)) signals.push('expert mentions');
    if (/case study|customer|client/i.test(body)) signals.push('case studies');
    return signals;
  }

  loadCompetitorData() {
    // This would load actual competitor analysis data
    return {
      topCompetitors: ['competitor1.com', 'competitor2.com'],
      averageContentLength: 2500,
      commonKeywords: ['interactive display', 'smartboard', 'collaboration']
    };
  }

  // Featured Snippets Helper Methods
  analyzeParagraphSnippets(body) {
    const paragraphs = body.split('\n\n').filter(p => p.trim().length > 0);
    const optimized = [];
    const potential = [];
    
    paragraphs.forEach((paragraph, index) => {
      const wordCount = paragraph.split(/\s+/).length;
      const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim().length > 0);
      
      // Check if paragraph answers common questions
      const answersQuestion = /^(what|how|why|when|where|which|who|whose|does|is|are|can|should|will|would)/i.test(paragraph) ||
                            /\b(is|are|means|refers to|defined as|consists of|includes|contains)\b/i.test(paragraph);
      
      if (wordCount >= 40 && wordCount <= 60 && sentences.length <= 3 && answersQuestion) {
        optimized.push({
          paragraph: paragraph.substring(0, 100) + '...',
          wordCount,
          sentenceCount: sentences.length,
          position: index + 1,
          snippetType: 'definition'
        });
      } else if (wordCount >= 30 && wordCount <= 80 && answersQuestion) {
        potential.push({
          paragraph: paragraph.substring(0, 100) + '...',
          wordCount,
          sentenceCount: sentences.length,
          position: index + 1,
          suggestion: wordCount < 40 ? 'Expand to 40-60 words' : 'Shorten to 40-60 words'
        });
      }
    });
    
    return { optimized, potential };
  }

  analyzeListSnippets(body) {
    const listRegex = /^(\d+\.\s+.*(?:\n(?!\d+\.\s+).*)*)/gm;
    const bulletRegex = /^[-*+]\s+.*(?:\n(?![-*+]\s+).*)*$/gm;
    
    const numberedLists = [...body.matchAll(listRegex)];
    const bulletLists = [...body.matchAll(bulletRegex)];
    
    const optimized = [];
    const potential = [];
    
    [...numberedLists, ...bulletLists].forEach(match => {
      const listContent = match[0];
      const items = listContent.split(/\n(?=\d+\.\s+|[-*+]\s+)/).filter(item => item.trim());
      
      if (items.length >= 3 && items.length <= 8) {
        const hasActionableItems = items.some(item => 
          /\b(step|first|second|third|next|then|finally|choose|select|click|install|configure|set up|create|add|remove|delete|update|check|verify|ensure|make sure)\b/i.test(item)
        );
        
        if (hasActionableItems) {
          optimized.push({
            type: listContent.match(/^\d+\./) ? 'numbered' : 'bulleted',
            itemCount: items.length,
            preview: items[0].substring(0, 50) + '...',
            snippetType: 'steps'
          });
        } else {
          potential.push({
            type: listContent.match(/^\d+\./) ? 'numbered' : 'bulleted',
            itemCount: items.length,
            preview: items[0].substring(0, 50) + '...',
            suggestion: 'Add action words and clear instructions'
          });
        }
      } else if (items.length > 8) {
        potential.push({
          type: listContent.match(/^\d+\./) ? 'numbered' : 'bulleted',
          itemCount: items.length,
          preview: items[0].substring(0, 50) + '...',
          suggestion: 'Break into smaller lists (3-8 items optimal)'
        });
      }
    });
    
    return { optimized, potential };
  }

  analyzeTableSnippets(body) {
    const tableRegex = /\|.*\|.*\n\|[-\s:|]*\|.*\n(\|.*\|.*\n)*/g;
    const tables = [...body.matchAll(tableRegex)];
    
    const optimized = [];
    const potential = [];
    
    tables.forEach(match => {
      const tableContent = match[0];
      const rows = tableContent.split('\n').filter(row => row.includes('|'));
      const headers = rows[0].split('|').filter(cell => cell.trim());
      const dataRows = rows.slice(2); // Skip header and separator
      
      if (headers.length >= 2 && headers.length <= 5 && dataRows.length >= 2 && dataRows.length <= 10) {
        const hasComparisonData = headers.some(header => 
          /\b(vs|versus|comparison|price|cost|rating|score|feature|specification|model|type|size|weight|dimension)\b/i.test(header)
        );
        
        if (hasComparisonData) {
          optimized.push({
            headerCount: headers.length,
            rowCount: dataRows.length,
            headers: headers.map(h => h.trim()),
            snippetType: 'comparison'
          });
        } else {
          potential.push({
            headerCount: headers.length,
            rowCount: dataRows.length,
            headers: headers.map(h => h.trim()),
            suggestion: 'Add comparison data (prices, ratings, features)'
          });
        }
      }
    });
    
    return { optimized, potential };
  }

  analyzeFAQSnippets(body) {
    const faqRegex = /^(#{1,6})\s+.*\?.*$/gm;
    const questions = [...body.matchAll(faqRegex)];
    
    const optimized = [];
    const potential = [];
    
    questions.forEach(match => {
      const questionHeading = match[0];
      const questionText = questionHeading.replace(/^#{1,6}\s+/, '');
      
      // Find the answer (content after the question heading)
      const questionIndex = body.indexOf(questionHeading);
      const nextHeadingIndex = body.indexOf('\n#', questionIndex + questionHeading.length);
      const answerText = body.substring(
        questionIndex + questionHeading.length,
        nextHeadingIndex === -1 ? body.length : nextHeadingIndex
      ).trim();
      
      const answerWordCount = answerText.split(/\s+/).length;
      
      if (answerWordCount >= 30 && answerWordCount <= 100) {
        optimized.push({
          question: questionText,
          answerWordCount,
          answerPreview: answerText.substring(0, 100) + '...',
          snippetType: 'faq'
        });
      } else if (answerText.length > 0) {
        potential.push({
          question: questionText,
          answerWordCount,
          answerPreview: answerText.substring(0, 100) + '...',
          suggestion: answerWordCount < 30 ? 'Expand answer to 30-100 words' : 'Shorten answer to 30-100 words'
        });
      }
    });
    
    return { optimized, potential };
  }

  analyzeHowToSnippets(body) {
    const howToRegex = /^(#{1,6})\s+.*\b(how to|how do|step by step|guide|tutorial|instructions|process)\b.*$/gmi;
    const howToSections = [...body.matchAll(howToRegex)];
    
    const optimized = [];
    const potential = [];
    
    howToSections.forEach(match => {
      const headingText = match[0];
      const sectionIndex = body.indexOf(headingText);
      const nextHeadingIndex = body.indexOf('\n#', sectionIndex + headingText.length);
      const sectionContent = body.substring(
        sectionIndex + headingText.length,
        nextHeadingIndex === -1 ? body.length : nextHeadingIndex
      );
      
      // Check for numbered steps
      const numberedSteps = sectionContent.match(/^\d+\.\s+.*$/gm);
      const hasSteps = numberedSteps && numberedSteps.length >= 3;
      const hasActionWords = /\b(click|select|choose|install|configure|set up|create|add|remove|delete|update|check|verify|ensure|make sure|download|upload|connect|disconnect|enter|type|copy|paste|save|open|close)\b/i.test(sectionContent);
      
      if (hasSteps && hasActionWords) {
        optimized.push({
          title: headingText.replace(/^#{1,6}\s+/, ''),
          stepCount: numberedSteps.length,
          steps: numberedSteps.slice(0, 3).map(step => step.substring(0, 60) + '...'),
          snippetType: 'howto'
        });
      } else if (hasSteps || hasActionWords) {
        potential.push({
          title: headingText.replace(/^#{1,6}\s+/, ''),
          stepCount: numberedSteps ? numberedSteps.length : 0,
          suggestion: !hasSteps ? 'Add numbered steps' : 'Add more action words and clear instructions'
        });
      }
    });
    
    return { optimized, potential };
  }

  analyzeDefinitionSnippets(body) {
    const definitionPatterns = [
      /\b(\w+)\s+(is|are|means|refers to|defined as|consists of|includes|contains)\b.*$/gmi,
      /^(#{1,6})\s+What is\s+.*$/gmi,
      /^(#{1,6})\s+.*Definition.*$/gmi
    ];
    
    const optimized = [];
    const potential = [];
    
    definitionPatterns.forEach(pattern => {
      const matches = [...body.matchAll(pattern)];
      
      matches.forEach(match => {
        const definitionText = match[0];
        const wordCount = definitionText.split(/\s+/).length;
        
        if (wordCount >= 15 && wordCount <= 50) {
          optimized.push({
            term: match[1] || 'Term',
            definition: definitionText.substring(0, 100) + '...',
            wordCount,
            snippetType: 'definition'
          });
        } else if (wordCount >= 10) {
          potential.push({
            term: match[1] || 'Term',
            definition: definitionText.substring(0, 100) + '...',
            wordCount,
            suggestion: wordCount < 15 ? 'Expand definition to 15-50 words' : 'Shorten definition to 15-50 words'
          });
        }
      });
    });
    
    return { optimized, potential };
  }

  hasQuestionKeywords(title, body) {
    const questionKeywords = [
      'what', 'how', 'why', 'when', 'where', 'which', 'who', 'whose',
      'does', 'is', 'are', 'can', 'should', 'will', 'would', 'could',
      'best', 'top', 'better', 'vs', 'versus', 'compare', 'comparison',
      'guide', 'tutorial', 'tips', 'examples', 'list', 'types', 'benefits'
    ];
    
    const titleAndBody = (title + ' ' + body).toLowerCase();
    const foundKeywords = questionKeywords.filter(keyword => 
      titleAndBody.includes(keyword)
    );
    
    let score = 0;
    if (foundKeywords.length >= 5) score = 10;
    else if (foundKeywords.length >= 3) score = 7;
    else if (foundKeywords.length >= 1) score = 3;
    
    return {
      score,
      keywords: foundKeywords,
      count: foundKeywords.length
    };
  }

  // Schema Markup Helper Methods
  detectSchemaOpportunities(frontmatter, body) {
    const opportunities = {
      article: this.detectArticleSchema(frontmatter, body),
      faq: this.detectFAQSchema(body),
      howTo: this.detectHowToSchema(body),
      product: this.detectProductSchema(frontmatter, body),
      review: this.detectReviewSchema(body),
      organization: this.detectOrganizationSchema(frontmatter, body),
      breadcrumb: this.detectBreadcrumbSchema(frontmatter),
      video: this.detectVideoSchema(body),
      localBusiness: this.detectLocalBusinessSchema(frontmatter, body)
    };
    
    return opportunities;
  }

  detectArticleSchema(frontmatter, body) {
    const hasTitle = frontmatter.title;
    const hasAuthor = frontmatter.author;
    const hasDate = frontmatter.publishDate || frontmatter.date;
    const hasDescription = frontmatter.description;
    const wordCount = body.split(/\s+/).length;
    
    return {
      detected: hasTitle && hasAuthor && hasDate && wordCount > 300,
      properties: {
        headline: hasTitle,
        author: hasAuthor,
        datePublished: hasDate,
        description: hasDescription,
        wordCount: wordCount
      },
      potential: []
    };
  }

  detectFAQSchema(body) {
    const faqRegex = /^(#{1,6})\s+.*\?.*$/gm;
    const questions = [...body.matchAll(faqRegex)];
    
    const faqQuestions = questions.map(match => {
      const questionHeading = match[0];
      const questionText = questionHeading.replace(/^#{1,6}\s+/, '');
      
      const questionIndex = body.indexOf(questionHeading);
      const nextHeadingIndex = body.indexOf('\n#', questionIndex + questionHeading.length);
      const answerText = body.substring(
        questionIndex + questionHeading.length,
        nextHeadingIndex === -1 ? body.length : nextHeadingIndex
      ).trim();
      
      return {
        question: questionText,
        answer: answerText
      };
    });
    
    return {
      detected: faqQuestions.length >= 3,
      properties: {
        questionCount: faqQuestions.length
      },
      questions: faqQuestions,
      potential: faqQuestions.length > 0 && faqQuestions.length < 3 ? faqQuestions : []
    };
  }

  detectHowToSchema(body) {
    const howToRegex = /^(#{1,6})\s+.*\b(how to|how do|step by step|guide|tutorial|instructions|process)\b.*$/gmi;
    const howToSections = [...body.matchAll(howToRegex)];
    
    const steps = [];
    howToSections.forEach(match => {
      const headingText = match[0];
      const sectionIndex = body.indexOf(headingText);
      const nextHeadingIndex = body.indexOf('\n#', sectionIndex + headingText.length);
      const sectionContent = body.substring(
        sectionIndex + headingText.length,
        nextHeadingIndex === -1 ? body.length : nextHeadingIndex
      );
      
      const numberedSteps = sectionContent.match(/^\d+\.\s+.*$/gm);
      if (numberedSteps) {
        steps.push(...numberedSteps.map(step => step.replace(/^\d+\.\s+/, '')));
      }
    });
    
    return {
      detected: steps.length >= 3,
      properties: {
        stepCount: steps.length,
        title: howToSections[0] ? howToSections[0][0].replace(/^#{1,6}\s+/, '') : ''
      },
      steps: steps,
      potential: steps.length > 0 && steps.length < 3 ? steps : []
    };
  }

  detectProductSchema(frontmatter, body) {
    const productIndicators = [
      'price', 'cost', '$', 'buy', 'purchase', 'order', 'model', 'specification',
      'feature', 'brand', 'manufacturer', 'warranty', 'review', 'rating'
    ];
    
    const hasProductIndicators = productIndicators.some(indicator => 
      body.toLowerCase().includes(indicator)
    );
    
    const hasProductCategory = frontmatter.category && 
      ['product', 'review', 'comparison'].includes(frontmatter.category.toLowerCase());
    
    return {
      detected: hasProductIndicators && hasProductCategory,
      properties: {
        hasPrice: /\$\d+|\d+\s*dollars?/i.test(body),
        hasBrand: /brand|manufacturer/i.test(body),
        hasModel: /model|version/i.test(body),
        hasRating: /rating|star|score|\d+\/\d+|\d+\.\d+/i.test(body)
      },
      details: {
        category: frontmatter.category,
        productIndicators: productIndicators.filter(indicator => 
          body.toLowerCase().includes(indicator)
        )
      }
    };
  }

  detectReviewSchema(body) {
    const reviewIndicators = [
      'review', 'rating', 'stars', 'score', 'pros', 'cons', 'verdict',
      'recommendation', 'tested', 'experience', 'opinion'
    ];
    
    const hasReviewIndicators = reviewIndicators.filter(indicator => 
      body.toLowerCase().includes(indicator)
    ).length >= 3;
    
    const hasRatingScale = /\d+\/\d+|\d+\.\d+|★|⭐|stars?/i.test(body);
    
    return {
      detected: hasReviewIndicators && hasRatingScale,
      properties: {
        hasRating: hasRatingScale,
        hasProsAndCons: /pros|advantages|benefits/i.test(body) && /cons|disadvantages|drawbacks/i.test(body),
        hasVerdict: /verdict|conclusion|recommendation|final thoughts/i.test(body)
      },
      details: {
        reviewIndicators: reviewIndicators.filter(indicator => 
          body.toLowerCase().includes(indicator)
        )
      }
    };
  }

  detectOrganizationSchema(frontmatter, body) {
    const organizationIndicators = [
      'company', 'business', 'organization', 'founded', 'headquarters',
      'employees', 'services', 'contact', 'about us', 'team'
    ];
    
    const hasOrganizationContent = organizationIndicators.some(indicator => 
      body.toLowerCase().includes(indicator)
    );
    
    return {
      detected: hasOrganizationContent,
      properties: {
        hasContactInfo: /contact|phone|email|address/i.test(body),
        hasServices: /services|products|offerings/i.test(body),
        hasLocation: /address|location|city|state|country/i.test(body)
      }
    };
  }

  detectBreadcrumbSchema(frontmatter) {
    const hasCategory = frontmatter.category;
    const hasSlug = frontmatter.slug;
    
    return {
      detected: hasCategory && hasSlug,
      properties: {
        category: hasCategory,
        slug: hasSlug,
        title: frontmatter.title
      }
    };
  }

  detectVideoSchema(body) {
    const videoIndicators = [
      'video', 'youtube', 'vimeo', 'watch', 'tutorial', 'demonstration',
      'embed', 'iframe', 'mp4', 'webm', 'mov'
    ];
    
    const hasVideoContent = videoIndicators.some(indicator => 
      body.toLowerCase().includes(indicator)
    );
    
    const hasVideoEmbed = /<iframe|<video|youtube\.com|vimeo\.com/i.test(body);
    
    return {
      detected: hasVideoContent && hasVideoEmbed,
      properties: {
        hasEmbed: hasVideoEmbed,
        hasDuration: /duration|length|minutes|seconds/i.test(body),
        hasDescription: /description|about|summary/i.test(body)
      },
      details: {
        videoIndicators: videoIndicators.filter(indicator => 
          body.toLowerCase().includes(indicator)
        )
      }
    };
  }

  detectLocalBusinessSchema(frontmatter, body) {
    const locationIndicators = [
      'address', 'location', 'hours', 'phone', 'contact', 'visit',
      'directions', 'map', 'city', 'state', 'zip', 'country'
    ];
    
    const hasLocationContent = locationIndicators.filter(indicator => 
      body.toLowerCase().includes(indicator)
    ).length >= 3;
    
    return {
      detected: hasLocationContent,
      properties: {
        hasAddress: /address|location/i.test(body),
        hasPhone: /phone|call|contact/i.test(body),
        hasHours: /hours|open|closed|schedule/i.test(body),
        hasMap: /map|directions|navigate/i.test(body)
      },
      details: {
        locationIndicators: locationIndicators.filter(indicator => 
          body.toLowerCase().includes(indicator)
        )
      }
    };
  }

  // Schema Generation Methods
  generateArticleSchema(frontmatter, body) {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": frontmatter.title,
      "author": {
        "@type": "Person",
        "name": frontmatter.author
      },
      "datePublished": frontmatter.publishDate || frontmatter.date,
      "dateModified": frontmatter.updatedDate || frontmatter.publishDate || frontmatter.date,
      "description": frontmatter.description,
      "wordCount": body.split(/\s+/).length,
      "articleSection": frontmatter.category || "General"
    };
  }

  generateFAQSchema(questions) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": questions.map(qa => ({
        "@type": "Question",
        "name": qa.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": qa.answer
        }
      }))
    };
  }

  generateHowToSchema(steps) {
    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "step": steps.map((step, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "text": step
      }))
    };
  }

  generateProductSchema(details) {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "category": details.category,
      "brand": details.brand || "Unknown",
      "model": details.model || "Unknown"
    };
  }

  generateReviewSchema(details) {
    return {
      "@context": "https://schema.org",
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "4.5",
        "bestRating": "5"
      }
    };
  }

  generateOrganizationSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Interactive Display Solutions",
      "description": "Leading provider of interactive displays and smartboards"
    };
  }

  generateBreadcrumbSchema(frontmatter) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": frontmatter.category,
          "item": `/${frontmatter.category}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": frontmatter.title,
          "item": `/${frontmatter.category}/${frontmatter.slug}`
        }
      ]
    };
  }

  generateVideoSchema(details) {
    return {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": "Video Title",
      "description": "Video description",
      "contentUrl": "https://example.com/video.mp4",
      "embedUrl": "https://example.com/embed/video"
    };
  }

  generateLocalBusinessSchema(details) {
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Business Name",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Main St",
        "addressLocality": "City",
        "addressRegion": "State",
        "postalCode": "12345"
      },
      "telephone": "+1-555-123-4567"
    };
  }

  getSchemaImportance(schemaType) {
    const importance = {
      'FAQPage': 1,
      'HowTo': 2,
      'Article': 3,
      'VideoObject': 4,
      'LocalBusiness': 5,
      'Product': 6,
      'Review': 7,
      'BreadcrumbList': 8,
      'Organization': 9
    };
    return importance[schemaType] || 10;
  }

  generateSchemaImplementationGuide(schemas) {
    return {
      priority: "Implement in order of importance",
      steps: [
        "1. Add schema markup to HTML head section",
        "2. Test markup with Google's Rich Results Test",
        "3. Monitor Search Console for rich results",
        "4. Update schema when content changes"
      ],
      schemas: schemas.map(schema => ({
        type: schema.type,
        priority: schema.priority,
        implementation: "Add JSON-LD script tag with schema data"
      }))
    };
  }

  // Export analysis as structured report
  formatAnalysisReport(analysis) {
    const report = {
      summary: {
        file: analysis.file,
        overallScore: analysis.overall,
        timestamp: analysis.timestamp,
        grade: this.getGrade(analysis.overall)
      },
      scores: analysis.scores,
      recommendations: analysis.recommendations,
      warnings: analysis.warnings,
      passes: analysis.passes
    };

    return report;
  }

  getGrade(score) {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  }
}

export default SEOAgent;