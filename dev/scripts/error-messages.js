#!/usr/bin/env node

const errorMessages = {
  PERMISSION_DENIED: {
    code: 'EPERM',
    message: 'Permission denied',
    solution: 'Run: chmod +x [file]',
    aiHint: 'File needs executable permissions',
    category: 'system'
  },
  COMMAND_NOT_FOUND: {
    code: 'ENOENT',
    message: 'Command not found',
    solution: 'Check npm run help for available commands',
    aiHint: 'Command may not be mapped to npm script',
    category: 'usage'
  },
  MISSING_DEPENDENCY: {
    code: 'EDEP',
    message: 'Missing dependency',
    solution: 'Run: npm install',
    aiHint: 'Package.json dependencies not installed',
    category: 'setup'
  },
  PYTHON_NOT_FOUND: {
    code: 'EPYTHON',
    message: 'Python interpreter not found',
    solution: 'Install Python 3.x or run: npm run rag:setup',
    aiHint: 'RAG tools require Python environment',
    category: 'setup'
  },
  MISSING_FILE_PARAMETER: {
    code: 'EFILE',
    message: 'File parameter required',
    solution: 'Add --file [path] to your command',
    aiHint: 'Command requires file path argument',
    category: 'usage'
  },
  TYPESCRIPT_ERROR: {
    code: 'ETSC',
    message: 'TypeScript compilation failed',
    solution: 'Run: npm run code:typecheck for details',
    aiHint: 'Fix TypeScript errors before proceeding',
    category: 'code'
  },
  BUILD_FAILED: {
    code: 'EBUILD',
    message: 'Build process failed',
    solution: 'Try: npm run dev:build:fast or check logs',
    aiHint: 'Build may have import or compilation errors',
    category: 'build'
  },
  VPS_API_ERROR: {
    code: 'EVPS',
    message: 'VPS API connection failed',
    solution: 'Check DO_API_TOKEN environment variable',
    aiHint: 'DigitalOcean API credentials may be invalid',
    category: 'api'
  },
  RAG_API_ERROR: {
    code: 'ERAG',
    message: 'RAG system API error',
    solution: 'Check GEMINI_API_KEY environment variable',
    aiHint: 'Gemini API credentials may be invalid or quota exceeded',
    category: 'api'
  },
  GIT_ERROR: {
    code: 'EGIT',
    message: 'Git operation failed',
    solution: 'Check git status and resolve conflicts',
    aiHint: 'Repository may have uncommitted changes or conflicts',
    category: 'git'
  },
  VALIDATION_FAILED: {
    code: 'EVAL',
    message: 'Tool validation failed',
    solution: 'Run: npm run ai:validate:all for details',
    aiHint: 'One or more tools are not working correctly',
    category: 'validation'
  },
  NETWORK_ERROR: {
    code: 'ENET',
    message: 'Network connection failed',
    solution: 'Check internet connection and try again',
    aiHint: 'Command requires internet access',
    category: 'network'
  },
  INVALID_JSON: {
    code: 'EJSON',
    message: 'Invalid JSON output',
    solution: 'Check command syntax or remove --json flag',
    aiHint: 'Command output could not be parsed as JSON',
    category: 'output'
  }
};

// Format errors for AI consumption
function formatError(error, context = {}) {
  const known = errorMessages[error.code];
  
  if (known) {
    return {
      error: known.code,
      message: known.message,
      solution: known.solution,
      aiHint: known.aiHint,
      category: known.category,
      context: context,
      original: error.message,
      timestamp: new Date().toISOString()
    };
  }
  
  return {
    error: 'UNKNOWN',
    message: error.message,
    solution: 'Check npm run help or documentation',
    aiHint: 'Unhandled error type - may need investigation',
    category: 'unknown',
    context: context,
    original: error.message,
    timestamp: new Date().toISOString()
  };
}

// Smart error detection from command output
function detectErrorType(output, command = '', exitCode = null) {
  const lowerOutput = output.toLowerCase();
  
  // Permission errors
  if (lowerOutput.includes('permission denied') || lowerOutput.includes('eacces')) {
    return { code: 'PERMISSION_DENIED' };
  }
  
  // Command not found
  if (lowerOutput.includes('command not found') || lowerOutput.includes('enoent')) {
    return { code: 'COMMAND_NOT_FOUND' };
  }
  
  // Python errors
  if (lowerOutput.includes('python: command not found') || lowerOutput.includes('python3: command not found')) {
    return { code: 'PYTHON_NOT_FOUND' };
  }
  
  // TypeScript errors
  if (lowerOutput.includes('typescript') && (lowerOutput.includes('error') || exitCode !== 0)) {
    return { code: 'TYPESCRIPT_ERROR' };
  }
  
  // Build errors
  if (command.includes('build') && exitCode !== 0) {
    return { code: 'BUILD_FAILED' };
  }
  
  // Missing file parameter
  if (lowerOutput.includes('file') && lowerOutput.includes('required')) {
    return { code: 'MISSING_FILE_PARAMETER' };
  }
  
  // Git errors
  if (lowerOutput.includes('git') && lowerOutput.includes('error')) {
    return { code: 'GIT_ERROR' };
  }
  
  // Network errors
  if (lowerOutput.includes('network') || lowerOutput.includes('timeout') || lowerOutput.includes('connection')) {
    return { code: 'NETWORK_ERROR' };
  }
  
  // JSON parsing errors
  if (lowerOutput.includes('json') && lowerOutput.includes('parse')) {
    return { code: 'INVALID_JSON' };
  }
  
  // API errors
  if (lowerOutput.includes('api') && lowerOutput.includes('error')) {
    if (command.includes('vps')) {
      return { code: 'VPS_API_ERROR' };
    }
    if (command.includes('rag')) {
      return { code: 'RAG_API_ERROR' };
    }
  }
  
  // Validation errors
  if (lowerOutput.includes('validation') && lowerOutput.includes('failed')) {
    return { code: 'VALIDATION_FAILED' };
  }
  
  // Generic error with exit code
  if (exitCode !== 0) {
    return { code: 'UNKNOWN', message: output };
  }
  
  return null;
}

// Generate help text for error
function getErrorHelp(errorCode) {
  const error = errorMessages[errorCode];
  if (!error) return 'No help available for this error.';
  
  return `
🚨 Error: ${error.message}

💡 Solution: ${error.solution}

🤖 AI Hint: ${error.aiHint}

📁 Category: ${error.category}

For more help:
- npm run help
- npm run ai:validate:all
- Check documentation: AI_DEVELOPER_GUIDE.md
`;
}

// Main CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === '--help' || command === '-h') {
    console.log(`
Error Message System
===================

Usage:
  node scripts/error-messages.js [command]

Commands:
  list                    List all error codes
  help [code]            Get help for specific error
  detect [output]        Detect error type from output
  format [code]          Format error for display

Examples:
  node scripts/error-messages.js list
  node scripts/error-messages.js help EPERM
  node scripts/error-messages.js detect "Permission denied"
`);
    process.exit(0);
  }
  
  if (command === 'list') {
    console.log('\nAvailable Error Codes:\n');
    Object.entries(errorMessages).forEach(([code, error]) => {
      console.log(`${code.padEnd(20)} ${error.message}`);
    });
    process.exit(0);
  }
  
  if (command === 'help') {
    const errorCode = args[1];
    if (!errorCode) {
      console.log('Error: Please specify an error code');
      process.exit(1);
    }
    console.log(getErrorHelp(errorCode.toUpperCase()));
    process.exit(0);
  }
  
  if (command === 'detect') {
    const output = args.slice(1).join(' ');
    const detected = detectErrorType(output);
    if (detected) {
      console.log(JSON.stringify(formatError(detected), null, 2));
    } else {
      console.log('No error pattern detected');
    }
    process.exit(0);
  }
  
  if (command === 'format') {
    const errorCode = args[1];
    const error = errorMessages[errorCode];
    if (error) {
      console.log(JSON.stringify(formatError({ code: errorCode }), null, 2));
    } else {
      console.log(`Error code ${errorCode} not found`);
    }
    process.exit(0);
  }
  
  console.log('Unknown command. Use --help for usage information.');
  process.exit(1);
}

// Export for use in other scripts
export { errorMessages, formatError, detectErrorType, getErrorHelp };