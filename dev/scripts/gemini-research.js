#!/usr/bin/env node

/**
 * Gemini Research Integration for BS Display
 * Provides structured research capabilities using Gemini CLI
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import path from 'path';

const RESEARCH_TYPES = {
  competitors: "Analyze top competitors in interactive display market including pricing, features, and market positioning",
  trends: "Research latest trends, innovations, and market developments in interactive displays and smartboards",
  specifications: "Research current product specifications, technical features, and industry standards for interactive displays",
  blogtopics: "Research trending blog topics and SEO keywords for interactive displays, smartboards, and educational technology",
  pricing: "Analyze current market pricing trends and pricing strategies for interactive display products",
  features: "Research most requested features and functionality in modern interactive displays and smartboards"
};

function runGeminiResearch(prompt, outputFile = null) {
  try {
    console.log('🔍 Starting Gemini research...');
    console.log(`📝 Query: ${prompt}`);
    
    const result = execSync(`gemini -p "${prompt}"`, { 
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    if (outputFile) {
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${timestamp}-${outputFile}.md`;
      const filepath = path.join('research', filename);
      
      const content = `# Research Report: ${outputFile}\n\n**Date:** ${new Date().toLocaleDateString()}\n**Query:** ${prompt}\n\n---\n\n${result}`;
      
      try {
        writeFileSync(filepath, content);
        console.log(`📁 Research saved to: ${filepath}`);
      } catch (err) {
        console.log('📁 Research folder not found, saving to current directory...');
        writeFileSync(filename, content);
        console.log(`📁 Research saved to: ${filename}`);
      }
    }
    
    return result;
  } catch (error) {
    console.error('❌ Research failed:', error.message);
    process.exit(1);
  }
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('🤖 BS Display - Gemini Research Tool');
    console.log('=====================================');
    console.log('');
    console.log('Available research types:');
    Object.keys(RESEARCH_TYPES).forEach(type => {
      console.log(`  ${type}: ${RESEARCH_TYPES[type]}`);
    });
    console.log('');
    console.log('Usage:');
    console.log('  node scripts/gemini-research.js <type>');
    console.log('  node scripts/gemini-research.js custom "Your custom research prompt"');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/gemini-research.js competitors');
    console.log('  node scripts/gemini-research.js custom "Latest smartboard features for education"');
    return;
  }
  
  const type = args[0];
  
  if (type === 'custom') {
    if (args.length < 2) {
      console.error('❌ Custom research requires a prompt');
      process.exit(1);
    }
    const customPrompt = args.slice(1).join(' ');
    const result = runGeminiResearch(customPrompt, 'custom-research');
    console.log('\n📊 Research Results:');
    console.log('====================');
    console.log(result);
  } else if (RESEARCH_TYPES[type]) {
    const result = runGeminiResearch(RESEARCH_TYPES[type], type);
    console.log('\n📊 Research Results:');
    console.log('====================');
    console.log(result);
  } else {
    console.error(`❌ Unknown research type: ${type}`);
    console.error('Available types:', Object.keys(RESEARCH_TYPES).join(', '));
    process.exit(1);
  }
}

main();