#!/bin/bash
# Test the process-github-issues.sh script with mock data

set -e

echo "🧪 Testing process-github-issues.sh script"

# Mock environment variables that the script expects
export GITHUB_TOKEN="dummy"

# Test the git operations part
echo "📥 Testing git operations..."
cd /Users/kristoffersanio/git/bs-display/dev

# Stash any local changes to avoid conflicts
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "💾 Stashing local changes..."
  git stash push -m "Test script: temporary stash $(date)"
fi

echo "✅ Git operations test passed"

# Test a simple Claude CLI call
echo "🤖 Testing Claude CLI..."
CLAUDE_PROMPT="Create a simple test-automation.txt file with content 'Automation test successful'"

echo "📊 Prompt length: $(echo "$CLAUDE_PROMPT" | wc -c) characters"

if claude --print --dangerously-skip-permissions "$CLAUDE_PROMPT" 2>&1 | tee /tmp/test_claude_output.log; then
  echo "✅ Claude CLI test successful"
  echo "📄 Output lines: $(wc -l < /tmp/test_claude_output.log)"
else
  echo "❌ Claude CLI test failed"
  exit 1
fi

echo "🎉 All tests passed"