#!/usr/bin/env node

/**
 * CSS Cleanup Progress Update Script
 * Automatically scans for completion reports and updates tracking files
 */

import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_PATH = path.join(__dirname, '../docs/internal/css-cleanup');
const TRACKER_PATH = path.join(DOCS_PATH, 'progress-tracker.md');
const README_PATH = path.join(DOCS_PATH, 'README.md');

// Configuration for phases and expected days
const PHASES = {
  1: { name: 'Foundation & Quick Wins', days: [1, 2, 3, 4, 5] },
  2: { name: 'Variable Consolidation', days: [6, 7, 8, 9, 10] },
  3: { name: 'Component Migration', days: [11, 12, 13, 14, 15, 16] },
  4: { name: 'Final Validation', days: [17, 18, 19, 20, 21] },
  5: { name: 'Documentation & Handoff', days: [22, 23, 24, 25] }
};

/**
 * Find all day-related files that indicate completion
 */
async function findCompletionReports() {
  const patterns = [
    `${DOCS_PATH}/**/day-*-completion*.md`,
    `${DOCS_PATH}/**/day-*-progress*.md`,
    `${DOCS_PATH}/**/day-*-checkpoint*.md`,
    `${DOCS_PATH}/**/day-*.md`, // Include all day files as potential completion indicators
    `${DOCS_PATH}/**/phase-*-completion*.md`
  ];
  
  const files = [];
  for (const pattern of patterns) {
    const matches = await glob(pattern);
    files.push(...matches);
  }
  
  return files;
}

/**
 * Extract day number from filename
 */
function extractDayNumber(filename) {
  const match = filename.match(/day-(\d+)/i);
  return match ? parseInt(match[1]) : null;
}

/**
 * Extract phase number from filename
 */
function extractPhaseNumber(filename) {
  const match = filename.match(/phase-(\d+)/i);
  return match ? parseInt(match[1]) : null;
}

/**
 * Parse completion date from file content
 */
async function extractCompletionDate(filepath) {
  try {
    const content = await fs.readFile(filepath, 'utf8');
    const dateMatch = content.match(/(?:completed|date|updated).*?(\d{4}-\d{2}-\d{2})/i);
    return dateMatch ? dateMatch[1] : null;
  } catch (error) {
    return null;
  }
}

/**
 * Parse completed days from README.md (authoritative source)
 */
async function getCompletedDaysFromReadme() {
  try {
    const content = await fs.readFile(README_PATH, 'utf8');
    const completedDays = new Set();
    
    // Look for checkmarks (✅) in daily plans sections
    const lines = content.split('\n');
    for (const line of lines) {
      const match = line.match(/day-(\d+)[^✅]*✅/i);
      if (match) {
        completedDays.add(parseInt(match[1]));
      }
    }
    
    // Also look for completed phase indicators
    if (content.includes('Phase 1') && content.includes('COMPLETED')) {
      [1, 2, 3, 4, 5].forEach(day => completedDays.add(day));
    }
    if (content.includes('Phase 2') && content.includes('COMPLETED')) {
      [6, 7, 8, 9, 10].forEach(day => completedDays.add(day));
    }
    if (content.includes('Phase 3') && content.includes('COMPLETED')) {
      [11, 12, 13, 14, 15, 16].forEach(day => completedDays.add(day));
    }
    
    return completedDays;
  } catch (error) {
    console.warn('Could not read README.md:', error.message);
    return new Set();
  }
}

/**
 * Analyze completion status
 */
async function analyzeProgress() {
  const reports = await findCompletionReports();
  const readmeCompletedDays = await getCompletedDaysFromReadme();
  
  const progress = {
    completedDays: readmeCompletedDays, // Use README as authoritative source
    completedPhases: new Set(),
    lastUpdate: null,
    reports: {}
  };
  
  // Still collect report info for reference
  for (const report of reports) {
    const dayNum = extractDayNumber(report);
    const phaseNum = extractPhaseNumber(report);
    const date = await extractCompletionDate(report);
    
    if (dayNum) {
      progress.reports[`day-${dayNum}`] = {
        path: report,
        date: date
      };
    }
    
    if (phaseNum) {
      progress.completedPhases.add(phaseNum);
    }
    
    if (date && (!progress.lastUpdate || date > progress.lastUpdate)) {
      progress.lastUpdate = date;
    }
  }
  
  // Set default date if none found
  if (!progress.lastUpdate) {
    progress.lastUpdate = '2025-07-24';
  }
  
  return progress;
}

/**
 * Determine current phase based on completed days
 */
function getCurrentPhase(completedDays) {
  const maxDay = Math.max(...completedDays, 0);
  
  for (const [phase, config] of Object.entries(PHASES)) {
    if (config.days.includes(maxDay)) {
      return parseInt(phase);
    }
  }
  
  // If maxDay is beyond all defined days, we're in the last phase
  if (maxDay >= 25) return 5;
  
  // Otherwise, find the next phase
  for (const [phase, config] of Object.entries(PHASES)) {
    if (Math.min(...config.days) > maxDay) {
      return parseInt(phase);
    }
  }
  
  return 1;
}

/**
 * Check if a phase is complete
 */
function isPhaseComplete(phase, completedDays) {
  const config = PHASES[phase];
  return config.days.every(day => completedDays.has(day));
}

/**
 * Generate progress summary
 */
function generateSummary(progress) {
  const completedDaysArray = Array.from(progress.completedDays).sort((a, b) => a - b);
  const totalDays = 25;
  const completedCount = completedDaysArray.length;
  const percentage = Math.round((completedCount / totalDays) * 100);
  
  const currentPhase = getCurrentPhase(progress.completedDays);
  const phaseStatuses = {};
  
  for (const phase of Object.keys(PHASES)) {
    const phaseNum = parseInt(phase);
    if (isPhaseComplete(phaseNum, progress.completedDays)) {
      phaseStatuses[phaseNum] = '✅ COMPLETED';
    } else if (phaseNum === currentPhase) {
      phaseStatuses[phaseNum] = '🔄 IN PROGRESS';
    } else if (phaseNum < currentPhase) {
      phaseStatuses[phaseNum] = '⚠️ INCOMPLETE';
    } else {
      phaseStatuses[phaseNum] = '📋 PLANNED';
    }
  }
  
  return {
    totalDays,
    completedCount,
    percentage,
    completedDays: completedDaysArray,
    currentPhase,
    phaseStatuses,
    lastUpdate: progress.lastUpdate || new Date().toISOString().split('T')[0]
  };
}

/**
 * Update the progress tracker file
 */
async function updateProgressTracker(summary) {
  let content = await fs.readFile(TRACKER_PATH, 'utf8');
  
  // Update header stats
  content = content.replace(
    /\*\*Overall Progress\*\*: \d+\/\d+ days completed \(\d+%\)/,
    `**Overall Progress**: ${summary.completedCount}/${summary.totalDays} days completed (${summary.percentage}%)`
  );
  
  content = content.replace(
    /\*\*Last Updated\*\*: \d{4}-\d{2}-\d{2}/,
    `**Last Updated**: ${summary.lastUpdate}`
  );
  
  // Update phase statuses
  for (const [phase, status] of Object.entries(summary.phaseStatuses)) {
    const phaseName = PHASES[phase].name;
    const regex = new RegExp(`(Phase ${phase}[^|]*\\|[^|]*\\|)([^|]*)(\\|)`, 'g');
    content = content.replace(regex, `$1 ${status} $3`);
  }
  
  await fs.writeFile(TRACKER_PATH, content);
  console.log('✅ Updated progress-tracker.md');
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🔍 Scanning for completion reports...');
    const progress = await analyzeProgress();
    
    console.log(`📊 Found ${progress.completedDays.size} completed days`);
    
    const summary = generateSummary(progress);
    
    console.log(`📈 Progress: ${summary.percentage}% complete`);
    console.log(`📍 Current Phase: ${summary.currentPhase} - ${PHASES[summary.currentPhase].name}`);
    
    await updateProgressTracker(summary);
    
    console.log('\n📋 Phase Status:');
    for (const [phase, status] of Object.entries(summary.phaseStatuses)) {
      console.log(`  Phase ${phase}: ${status}`);
    }
    
    console.log('\n✅ Progress tracking updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating progress:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { analyzeProgress, generateSummary };