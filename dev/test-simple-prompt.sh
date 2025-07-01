#!/bin/bash
# Test with a much simpler prompt

echo "🧪 Testing simple Claude prompt"

SIMPLE_PROMPT="Fix issue #17: Improve the auto-claude workflow scripts. Make any necessary improvements to scripts/process-github-issues.sh"

echo "📊 Prompt length: $(echo "$SIMPLE_PROMPT" | wc -c) characters"
echo "📝 Prompt: $SIMPLE_PROMPT"

echo "⏳ Starting Claude CLI with simple prompt..."
if claude --print --dangerously-skip-permissions "$SIMPLE_PROMPT" 2>&1 | tee /tmp/simple_test.log; then
  echo "✅ Simple prompt worked"
  echo "📄 Output lines: $(wc -l < /tmp/simple_test.log)"
else
  echo "❌ Even simple prompt failed"
fi