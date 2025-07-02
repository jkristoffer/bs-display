#!/usr/bin/env node

import { readFileSync } from 'fs';

const args = process.argv.slice(2);
const typeFlag = args.find(arg => arg.startsWith('--type='));
const type = typeFlag ? typeFlag.split('=')[1] : 'generic';

// Read stdin
let input = '';
process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  let chunk;
  while ((chunk = process.stdin.read()) !== null) {
    input += chunk;
  }
});

process.stdin.on('end', () => {
  try {
    const formatted = formatOutput(input, type);
    console.log(JSON.stringify(formatted, null, 2));
  } catch (error) {
    console.error(JSON.stringify({
      error: 'Formatting failed',
      message: error.message,
      input: input.substring(0, 200) + '...'
    }, null, 2));
    process.exit(1);
  }
});

function formatOutput(output, type) {
  const timestamp = new Date().toISOString();
  
  switch (type) {
    case 'gitStatus':
      return formatGitStatus(output, timestamp);
    case 'codeReview':
      return formatCodeReview(output, timestamp);
    case 'seoAnalysis':
      return formatSeoAnalysis(output, timestamp);
    case 'vpsStatus':
      return formatVpsStatus(output, timestamp);
    case 'ragQuery':
      return formatRagQuery(output, timestamp);
    default:
      return formatGeneric(output, timestamp);
  }
}

function formatGitStatus(output, timestamp) {
  const lines = output.split('\n').filter(l => l.trim());
  const files = lines.map(line => {
    if (line.length < 3) return null;
    return {
      status: line.substring(0, 2).trim(),
      file: line.substring(3),
      staged: line[0] !== ' ',
      modified: line[1] !== ' '
    };
  }).filter(Boolean);

  return {
    type: 'git-status',
    timestamp,
    files,
    count: files.length,
    hasChanges: files.length > 0,
    staged: files.filter(f => f.staged).length,
    modified: files.filter(f => f.modified).length
  };
}

function formatCodeReview(output, timestamp) {
  const lines = output.split('\n');
  
  // Look for common code review patterns
  const passed = output.includes('PASS') || output.includes('✓') || output.includes('SUCCESS');
  const failed = output.includes('FAIL') || output.includes('✗') || output.includes('ERROR');
  
  // Extract score if present
  const scoreMatch = output.match(/score[:\s]+(\d+)/i);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : null;
  
  // Extract issues
  const issues = lines.filter(line => 
    line.includes('ERROR') || line.includes('WARNING') || line.includes('ISSUE')
  ).map(line => line.trim());

  return {
    type: 'code-review',
    timestamp,
    passed: passed && !failed,
    score,
    issues: issues.slice(0, 10), // Limit to 10 issues
    summary: passed ? 'Review passed' : failed ? 'Review failed' : 'Review completed'
  };
}

function formatSeoAnalysis(output, timestamp) {
  const lines = output.split('\n');
  
  // Look for SEO score
  const scoreMatch = output.match(/(?:score|rating)[:\s]+(\d+)/i);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : null;
  
  // Extract recommendations
  const recommendations = lines.filter(line =>
    line.includes('recommend') || line.includes('improve') || line.includes('optimize')
  ).map(line => line.trim()).slice(0, 5);

  return {
    type: 'seo-analysis',
    timestamp,
    score,
    recommendations,
    passed: score ? score >= 75 : null
  };
}

function formatVpsStatus(output, timestamp) {
  const lines = output.split('\n');
  
  // Look for droplet information
  const droplets = [];
  lines.forEach(line => {
    if (line.includes('ID') && line.includes('Name')) return; // Skip header
    const parts = line.split(/\s+/);
    if (parts.length >= 3 && parts[0].match(/^\d+$/)) {
      droplets.push({
        id: parts[0],
        name: parts[1],
        status: parts[2]
      });
    }
  });

  return {
    type: 'vps-status',
    timestamp,
    droplets,
    activeCount: droplets.filter(d => d.status === 'active').length,
    totalCount: droplets.length
  };
}

function formatRagQuery(output, timestamp) {
  return {
    type: 'rag-query',
    timestamp,
    response: output.trim(),
    length: output.length,
    hasResponse: output.trim().length > 0
  };
}

function formatGeneric(output, timestamp) {
  const lines = output.split('\n').filter(l => l.trim());
  
  return {
    type: 'generic',
    timestamp,
    output: output.trim(),
    lines: lines.length,
    hasContent: lines.length > 0
  };
}