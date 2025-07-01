#!/bin/bash
# Test script for simulating the process with issue #17

set -e

echo "🧪 Testing with Issue #17"

# Set up environment
export GITHUB_TOKEN="$GITHUB_TOKEN"  # Use existing token

# Simulate the issue processing part
ISSUE_NUM=17
ISSUE_TITLE="Refine Claude processing in auto-claude workflow"
ISSUE_BODY="Test prompt for Claude CLI to handle issue #17"

# Create focused prompt for Claude
CLAUDE_PROMPT="Implement this GitHub issue for the bs-display project:

ISSUE #$ISSUE_NUM: $ISSUE_TITLE

$ISSUE_BODY

REQUIREMENTS:
- This is an Astro-based e-commerce platform for interactive displays
- Follow functional programming principles with TypeScript
- Follow existing patterns in /src/components/ and /src/development-standards/
- Create or modify files as needed to implement the requested feature
- Ensure TypeScript compilation passes

AUTOMATION CONTEXT:
- This is running automatically on a VPS
- Implement the most reasonable interpretation if unclear
- Follow established project conventions
- Work autonomously and make the necessary changes"

echo "📊 Prompt length: $(echo "$CLAUDE_PROMPT" | wc -c) characters"
echo "📝 First 3 lines of prompt:"
echo "$CLAUDE_PROMPT" | head -3
echo "..."

# Test Claude CLI
echo "⏳ Starting Claude CLI test..."
if claude --print --dangerously-skip-permissions --verbose "$CLAUDE_PROMPT" 2>&1 | tee /tmp/test_claude_issue17.log; then
  echo "✅ Claude CLI completed successfully"
  echo "📄 Total output lines: $(wc -l < /tmp/test_claude_issue17.log)"
else
  CLAUDE_EXIT_CODE=$?
  echo "❌ Claude CLI failed (exit code: $CLAUDE_EXIT_CODE)"
  echo "🔍 Last 10 lines of output:"
  tail -10 /tmp/test_claude_issue17.log 2>/dev/null || echo "No output log available"
fi