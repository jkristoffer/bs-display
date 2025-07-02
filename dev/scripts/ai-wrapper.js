#!/usr/bin/env node

import { spawn } from 'child_process';
const args = process.argv.slice(2);

// Parse AI-specific flags
const dryRun = args.includes('--dry-run');
const jsonOutput = args.includes('--json');
const verbose = args.includes('--verbose');
const help = args.includes('--help');

// Remove AI flags before passing to actual command
const cleanArgs = args.filter(arg => 
  !['--dry-run', '--json', '--verbose', '--help'].includes(arg)
);

// Get the actual command to run
const command = cleanArgs[0];
const commandArgs = cleanArgs.slice(1);

// Implement dry-run
if (dryRun) {
  const result = {
    mode: 'dry-run',
    command: command,
    args: commandArgs,
    wouldExecute: true,
    timestamp: new Date().toISOString()
  };
  
  if (jsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`🏃 DRY RUN MODE`);
    console.log(`Command: ${command}`);
    console.log(`Arguments: ${commandArgs.join(' ')}`);
    console.log(`Would execute at: ${result.timestamp}`);
  }
  process.exit(0);
}

// Show help if requested
if (help) {
  console.log(`
AI Wrapper Help
===============

Available flags:
  --dry-run    Preview command without executing
  --json       Output results as JSON
  --verbose    Show detailed execution logs
  --help       Show this help message

Usage:
  node scripts/ai-wrapper.js [command] [args] [--flags]

Examples:
  node scripts/ai-wrapper.js ./scripts/commit --dry-run
  node scripts/ai-wrapper.js git status --json
  node scripts/ai-wrapper.js npm run build --verbose
  `);
  process.exit(0);
}

// Validate command exists
if (!command) {
  console.error('Error: No command specified');
  process.exit(1);
}

// Execute the command
const startTime = Date.now();

if (verbose) {
  console.log(`[VERBOSE] Starting execution at ${new Date().toISOString()}`);
  console.log(`[VERBOSE] Command: ${command}`);
  console.log(`[VERBOSE] Arguments: ${commandArgs.join(' ')}`);
  console.log(`[VERBOSE] Working directory: ${process.cwd()}`);
  console.log(`[VERBOSE] Environment: NODE_ENV=${process.env.NODE_ENV || 'undefined'}`);
  console.log(`[VERBOSE] ---`);
}

const child = spawn(command, commandArgs, {
  stdio: verbose ? 'pipe' : 'inherit',
  shell: true
});

if (verbose) {
  // Prefix output with timestamps in verbose mode
  child.stdout?.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`[${new Date().toLocaleTimeString()}] ${line}`);
      }
    });
  });

  child.stderr?.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.error(`[${new Date().toLocaleTimeString()}] ERROR: ${line}`);
      }
    });
  });
}

child.on('close', (code) => {
  const duration = Date.now() - startTime;
  
  if (verbose) {
    console.log(`[VERBOSE] Exit code: ${code}`);
    console.log(`[VERBOSE] Duration: ${duration}ms`);
  }
  
  if (jsonOutput) {
    const result = {
      command: command,
      args: commandArgs,
      exitCode: code,
      duration: duration,
      success: code === 0,
      timestamp: new Date().toISOString()
    };
    console.log(JSON.stringify(result, null, 2));
  }
  
  process.exit(code);
});

child.on('error', (error) => {
  if (verbose) {
    console.error(`[VERBOSE] Process error: ${error.message}`);
  }
  
  if (jsonOutput) {
    const result = {
      command: command,
      args: commandArgs,
      error: error.message,
      success: false,
      timestamp: new Date().toISOString()
    };
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.error(`Error executing command: ${error.message}`);
  }
  
  process.exit(1);
});