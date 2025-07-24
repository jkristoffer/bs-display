import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeCSSBundle } from './css-analysis.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * CSS Quality Monitoring Script
 * Tracks CSS bundle size trends and alerts on regressions
 */

const THRESHOLDS = {
  totalSizeKB: 700, // Alert if total CSS exceeds 700KB
  fileCount: 25,    // Alert if file count exceeds 25
  singleFileKB: 100 // Alert if any single file exceeds 100KB
};

const REPORTS_DIR = path.join(__dirname, '../reports');
const HISTORY_FILE = path.join(REPORTS_DIR, 'css-size-history.json');

function loadHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    }
  } catch (error) {
    console.warn('⚠️  Could not load CSS size history:', error.message);
  }
  return [];
}

function saveHistory(history) {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
  } catch (error) {
    console.error('❌ Could not save CSS size history:', error.message);
  }
}

function checkThresholds(analysis) {
  const issues = [];
  
  if (parseFloat(analysis.totalSizeKB) > THRESHOLDS.totalSizeKB) {
    issues.push(`Total CSS size (${analysis.totalSizeKB}KB) exceeds threshold (${THRESHOLDS.totalSizeKB}KB)`);
  }
  
  if (analysis.fileCount > THRESHOLDS.fileCount) {
    issues.push(`File count (${analysis.fileCount}) exceeds threshold (${THRESHOLDS.fileCount})`);
  }
  
  const largeFiles = analysis.files.filter(file => parseFloat(file.size) > THRESHOLDS.singleFileKB);
  if (largeFiles.length > 0) {
    largeFiles.forEach(file => {
      issues.push(`Large file: ${file.name} (${file.size}KB) exceeds threshold (${THRESHOLDS.singleFileKB}KB)`);
    });
  }
  
  return issues;
}

function analyzetrend(history) {
  if (history.length < 2) return null;
  
  const latest = history[history.length - 1];
  const previous = history[history.length - 2];
  
  const sizeChange = latest.totalSizeKB - previous.totalSizeKB;
  const percentChange = ((sizeChange / previous.totalSizeKB) * 100).toFixed(1);
  const fileCountChange = latest.fileCount - previous.fileCount;
  
  return {
    sizeChange: sizeChange.toFixed(2),
    percentChange,
    fileCountChange,
    trend: sizeChange > 0 ? 'increased' : 'decreased'
  };
}

function runMonitoring() {
  console.log('🔍 CSS Quality Monitoring');
  console.log('========================');
  
  // Run CSS analysis
  const analysis = analyzeCSSBundle();
  if (!analysis) {
    console.log('❌ Could not analyze CSS bundle. Run npm run build:fast first.');
    process.exit(1);
  }
  
  // Load history
  const history = loadHistory();
  
  // Add current analysis to history
  const timestamp = new Date().toISOString();
  const currentEntry = {
    timestamp,
    totalSizeKB: parseFloat(analysis.totalSizeKB),
    fileCount: analysis.fileCount,
    files: analysis.files.slice(0, 5) // Keep only top 5 largest files
  };
  
  history.push(currentEntry);
  
  // Keep only last 30 entries
  const trimmedHistory = history.slice(-30);
  saveHistory(trimmedHistory);
  
  // Check thresholds
  const issues = checkThresholds(analysis);
  
  // Analyze trend
  const trend = analyzetrend(trimmedHistory);
  
  // Report results
  console.log(`📊 Current Size: ${analysis.totalSizeKB}KB (${analysis.fileCount} files)`);
  
  if (trend) {
    const emoji = trend.trend === 'increased' ? '📈' : '📉';
    console.log(`${emoji} Trend: ${trend.sizeChange}KB (${trend.percentChange}%) since last check`);
    if (trend.fileCountChange !== 0) {
      console.log(`📁 File count change: ${trend.fileCountChange > 0 ? '+' : ''}${trend.fileCountChange}`);
    }
  }
  
  if (issues.length > 0) {
    console.log('\\n⚠️  Quality Issues:');
    issues.forEach(issue => console.log(`   • ${issue}`));
    console.log('\\n💡 Consider running Phase 2 variable consolidation or Phase 3 component migration.');
  } else {
    console.log('\\n✅ All quality thresholds passed!');
  }
  
  console.log(`\\n📁 History saved to: ${HISTORY_FILE}`);
  
  // Exit with error code if there are critical issues
  const criticalIssues = issues.filter(issue => 
    issue.includes('Total CSS size') || 
    issue.includes('exceeds threshold')
  );
  
  if (criticalIssues.length > 0) {
    process.exit(1);
  }
}

// Run if script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMonitoring();
}

export { runMonitoring, checkThresholds, analyzetrend };