#!/bin/bash
# Simple test of Claude CLI automation

set -e

echo "🧪 Testing Claude CLI automation"

# Test with a simple prompt
CLAUDE_PROMPT="Create a simple test.txt file with content 'Hello from automation test'"

echo "📊 Prompt length: $(echo "$CLAUDE_PROMPT" | wc -c) characters"
echo "📝 Prompt: $CLAUDE_PROMPT"

echo "⏳ Starting Claude CLI..."

# Simple test without complex piping
if claude --print --dangerously-skip-permissions "$CLAUDE_PROMPT"; then
  echo "✅ Claude CLI completed successfully"
else
  CLAUDE_EXIT_CODE=$?
  echo "❌ Claude CLI failed (exit code: $CLAUDE_EXIT_CODE)"
  exit 1
fi

echo "🎉 Test completed"