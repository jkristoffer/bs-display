# Enhanced Code Review System Guide

> **Enterprise-grade automated code quality analysis with security & performance auditing**

## Overview

The enhanced code review system provides comprehensive analysis of TypeScript, React, and JavaScript code with focus on functional programming, security vulnerabilities, and performance optimization. It uses a weighted scoring system (0-100) across 6 categories to ensure high-quality, secure, and performant code.

## Table of Contents

- [Quick Start](#quick-start)
- [Analysis Categories](#analysis-categories)
- [Configuration System](#configuration-system)
- [Usage Examples](#usage-examples)
- [Security Features](#security-features)
- [Performance Analysis](#performance-analysis)
- [AI Workflow Integration](#ai-workflow-integration)
- [Troubleshooting](#troubleshooting)

## Quick Start

### Basic Usage

```bash
# Analyze a single file
npm run code:review -- --file src/components/MyComponent.tsx

# Analyze a directory
npm run code:review -- --batch src/components/

# Generate configuration file
npm run code:review:config
```

### Installation & Setup

The code review system is automatically available after running `npm install`. No additional setup required unless you want custom configuration.

```bash
# Generate default configuration
npm run code:review:config

# Interactive configuration setup
npm run code:review:config:interactive
```

## Analysis Categories

### Weighted Scoring System

| Category | Weight | Focus |
|----------|--------|-------|
| 🔒 **Security** | 20% | XSS prevention, secrets detection, input validation |
| ⚡ **Functional Programming** | 25% | Pure functions, immutability, composition |
| 🚀 **Performance** | 10% | React optimization, memory leaks, bundle size |
| 📏 **Project Standards** | 15% | File naming, imports, styling consistency |
| 🔷 **TypeScript** | 15% | Type safety, interfaces, avoiding `any` |
| ⚛️ **React Patterns** | 15% | Hooks compliance, component optimization |

### 1. Security Analysis (20%)

**Protects against common web vulnerabilities and security issues**

#### XSS Vulnerabilities
- Detects `dangerouslySetInnerHTML` usage
- Flags `eval()` and Function constructor
- Identifies direct HTML injection patterns

#### Secrets Detection
- Scans for hardcoded API keys, passwords, tokens
- Detects console logging of sensitive data
- Identifies unsafe browser storage of credentials

#### Input Validation
- Finds form inputs without validation
- Detects potential SQL injection patterns
- Flags missing sanitization

#### Authentication Security
- Identifies weak session management
- Detects authentication bypass patterns
- Checks for client-side auth vulnerabilities

### 2. Functional Programming (25%)

**Enforces functional programming principles for maintainable code**

#### Pure Functions
- No global variable mutations
- Minimal console statements
- Deterministic behavior (no Math.random, Date.now)

#### Immutability
- Array methods over mutations (map, filter vs push, pop)
- Spread operators for object updates
- Const over let where possible

#### Function Composition
- Functions under 50 lines
- Arrow function preference
- Higher-order function usage

### 3. Performance Analysis (10%)

**Identifies performance bottlenecks and optimization opportunities**

#### React Performance
- Missing `React.memo` on components
- Event handlers without `useCallback`
- Expensive calculations without `useMemo`
- Inline object creation in JSX

#### Memory Leaks
- Missing cleanup in `useEffect`
- Global variable assignments
- Unhandled subscriptions

#### Algorithm Efficiency
- Nested loops detection
- Inefficient array operations
- Bundle size optimization

### 4. Project Standards (15%)

**Maintains consistent project conventions**

#### File Naming
- PascalCase for components
- camelCase for utilities
- SCSS module naming

#### Import/Export Patterns
- Relative import depth limits
- Proper React imports
- Clean export structure

### 5. TypeScript Quality (15%)

**Ensures type safety and best practices**

#### Type Annotations
- Function parameter types
- Return type annotations
- Interface usage over inline types

#### Type Safety
- Avoiding `any` type
- Proper generic usage
- Strict type checking

### 6. React Patterns (15%)

**Modern React best practices and performance**

#### Hooks Compliance
- Rules of hooks adherence
- Proper dependency arrays
- Conditional hook usage prevention

#### Component Optimization
- Memoization strategies
- Prop drilling detection
- Performance optimization

## Configuration System

### .codereview.json Structure

```json
{
  "version": "1.0.0",
  "rules": {
    "security": {
      "enabled": true,
      "weight": 0.20,
      "custom": {
        "checkXss": true,
        "checkSecrets": true,
        "strictMode": true
      }
    },
    "functionalProgramming": {
      "enabled": true,
      "weight": 0.25,
      "custom": {
        "maxFunctionLength": 50,
        "allowConsole": false,
        "enforceImmutability": true
      }
    }
  },
  "ignore": [
    "**/*.test.tsx",
    "**/*.spec.ts", 
    "**/node_modules/**"
  ],
  "thresholds": {
    "excellent": 90,
    "good": 80,
    "acceptable": 70,
    "failing": 60
  }
}
```

### Configuration Options

#### Rule Customization
- **Enable/disable** individual categories
- **Adjust weights** for project priorities
- **Custom settings** per rule category

#### Ignore Patterns
- **Glob patterns** for files/directories
- **Test files** automatically excluded
- **Build artifacts** ignored by default

#### Threshold Settings
- **Excellent** (90+): A grade
- **Good** (80-89): B grade  
- **Acceptable** (70-79): C grade
- **Failing** (<60): F grade

## Usage Examples

### Development Workflow

```bash
# Daily development - check your changes
npm run code:review -- --file src/components/NewFeature.tsx

# Pre-commit - analyze all modified files
git diff --name-only | grep -E '\\.(tsx?|jsx?)$' | xargs -I {} npm run code:review -- --file {}

# Feature completion - batch analysis
npm run code:review -- --batch src/features/authentication/

# Security audit - focus on sensitive components
npm run code:review -- --batch src/components/auth/ --format json | grep -A5 "security"
```

### Output Formats

#### Detailed Report (Default)
```bash
npm run code:review -- --file component.tsx --format detailed
```
Human-readable report with issues, recommendations, and score breakdown.

#### JSON Output (CI/CD Integration)
```bash
npm run code:review -- --file component.tsx --format json
```
Machine-readable output for automated processing and CI/CD pipelines.

#### Minimal Output (Quick Check)
```bash
npm run code:review -- --file component.tsx --format minimal
```
Concise score and top issues only.

### AI Workflow Integration

```bash
# Track AI-generated code with metadata
npm run code:review -- --file ai-generated.tsx \\
  --ai-mode \\
  --agent-id "claude-sonnet-4" \\
  --task-id "create-auth-modal"

# Automated quality gates (CI/CD)
npm run code:review -- --file component.tsx --ai-mode --format json
# Exit code 0: Pass, 1: Fail
```

## Security Features

### Vulnerability Detection

The security analysis module scans for common web application vulnerabilities:

#### Cross-Site Scripting (XSS)
```typescript
// ❌ Detected vulnerability
<div dangerouslySetInnerHTML={{__html: userInput}} />

// ✅ Recommended approach  
<div>{sanitizeHtml(userInput)}</div>
```

#### Secrets Exposure
```typescript
// ❌ Hardcoded secrets detected
const API_KEY = "sk-1234567890abcdef";
localStorage.setItem("auth-token", "secret-value");

// ✅ Environment variables
const API_KEY = process.env.VITE_API_KEY;
// Server-side session management
```

#### Input Validation
```typescript
// ❌ Unvalidated input
const handleSubmit = (data) => {
  fetch('/api/users', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  });
};

// ✅ Validated and sanitized
const handleSubmit = (data) => {
  const validated = userSchema.parse(data);
  const sanitized = sanitizeInput(validated);
  // Safe to use
};
```

## Performance Analysis

### React Performance Optimization

#### Component Memoization
```typescript
// ❌ Missing optimization
export default function ExpensiveComponent({data}) {
  return <div>{data.map(processData)}</div>;
}

// ✅ Optimized with memo
export default React.memo(function ExpensiveComponent({data}) {
  const processedData = useMemo(() => 
    data.map(processData), [data]);
  return <div>{processedData}</div>;
});
```

#### Event Handler Optimization
```typescript
// ❌ Re-created on every render
function Component() {
  const handleClick = () => doSomething();
  return <Button onClick={handleClick} />;
}

// ✅ Memoized event handler
function Component() {
  const handleClick = useCallback(() => doSomething(), []);
  return <Button onClick={handleClick} />;
}
```

### Memory Leak Prevention

#### Effect Cleanup
```typescript
// ❌ Missing cleanup
useEffect(() => {
  const interval = setInterval(updateData, 1000);
  // Memory leak: interval continues after unmount
}, []);

// ✅ Proper cleanup
useEffect(() => {
  const interval = setInterval(updateData, 1000);
  return () => clearInterval(interval);
}, []);
```

## AI Workflow Integration

### Metadata Tracking

The enhanced code review system supports AI workflow tracking:

```bash
# Track which AI agent generated code
npm run code:review -- --file component.tsx \\
  --ai-mode \\
  --agent-id "claude-sonnet-4" \\
  --task-id "implement-user-auth"
```

### Automated Quality Gates

```bash
# CI/CD Integration
#!/bin/bash
FILES=$(git diff --name-only origin/main...HEAD | grep -E '\\.(tsx?|jsx?)$')
for file in $FILES; do
  npm run code:review -- --file "$file" --ai-mode --format json
  if [ $? -ne 0 ]; then
    echo "Quality gate failed for $file"
    exit 1
  fi
done
```

### Learning Integration

The system provides structured feedback for AI learning:

```json
{
  "summary": {
    "overallScore": 85,
    "grade": "B (Good)",
    "status": "GOOD"
  },
  "categories": {
    "security": 100,
    "functionalProgramming": 75,
    "performance": 90
  },
  "learningPoints": [
    "Use immutable data patterns",
    "Implement proper error boundaries",
    "Add TypeScript return types"
  ]
}
```

## Troubleshooting

### Common Issues

#### Configuration Not Loading
```bash
# Check configuration file exists
ls -la .codereview.json

# Regenerate configuration
npm run code:review:config

# Verify JSON syntax
npm run code:review -- --file test.tsx --format json
```

#### Files Being Ignored
```bash
# Check ignore patterns in .codereview.json
cat .codereview.json | grep -A10 "ignore"

# Test specific file
npm run code:review -- --file path/to/file.tsx --format minimal
```

#### Low Scores
```bash
# Get detailed analysis
npm run code:review -- --file component.tsx --format detailed

# Focus on specific category
npm run code:review -- --file component.tsx --format json | grep -A5 "security"
```

### Performance Issues

#### Large Codebase Analysis
```bash
# Use batch mode with parallelization
npm run code:review -- --batch src/components/ --format minimal

# Analyze subset of files
npm run code:review -- --batch src/components/critical/ --format json
```

#### Memory Usage
```bash
# Monitor memory during analysis
npm run code:review -- --batch src/ --format minimal | head -20
```

### Integration Issues

#### CI/CD Pipeline
```yaml
# GitHub Actions example
- name: Code Review Analysis
  run: |
    files=$(git diff --name-only origin/main...HEAD | grep -E '\\.(tsx?|jsx?)$')
    for file in $files; do
      npm run code:review -- --file "$file" --ai-mode --format json || exit 1
    done
```

#### IDE Integration
```bash
# VS Code tasks.json
{
  "label": "Code Review",
  "type": "shell", 
  "command": "npm run code:review -- --file ${file} --format detailed"
}
```

## Advanced Features

### Custom Rules

Extend the system with project-specific rules by modifying `.codereview.json`:

```json
{
  "rules": {
    "security": {
      "custom": {
        "checkXss": true,
        "checkSecrets": true,
        "customPatterns": [
          {
            "pattern": "process\\.env\\.[A-Z_]+",
            "message": "Use typed environment variables",
            "severity": "warning"
          }
        ]
      }
    }
  }
}
```

### Reporting Integration

```bash
# Generate HTML reports (future feature)
npm run code:review -- --batch src/ --format html --output reports/

# Slack integration (future feature)  
npm run code:review -- --batch src/ --notify slack --channel "#code-quality"
```

### Metrics Tracking

Track code quality over time:

```bash
# Store metrics with timestamp
npm run code:review -- --batch src/ --format json > "reports/$(date +%Y-%m-%d).json"

# Compare against baseline
npm run code:review -- --batch src/ --baseline reports/baseline.json
```

---

## Additional Resources

- **[CLAUDE.md](../CLAUDE.md)** - Complete AI development guide
- **[README.md](../README.md)** - Project overview and setup
- **[Development Standards](../src/development-standards/)** - Implementation patterns
- **[Package.json Scripts](../package.json)** - All available commands

For questions or issues, refer to the troubleshooting section or consult the main project documentation.