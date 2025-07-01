#!/bin/bash
# Debug Claude CLI to find working configuration

echo "🔍 Debugging Claude CLI configurations..."

# Test 1: Check if Claude CLI responds to basic commands
echo "1️⃣ Testing basic auth status..."
if claude auth status; then
  echo "✅ Auth status works"
else
  echo "❌ Auth status fails"
fi

# Test 2: Try minimal prompt without --print
echo "2️⃣ Testing interactive mode (should exit quickly)..."
echo "exit" | claude --dangerously-skip-permissions "Hello" || echo "❌ Interactive mode failed"

# Test 3: Try different flag combinations
echo "3️⃣ Testing --print without --verbose..."
echo "Testing simple print" | timeout 10 claude --print --dangerously-skip-permissions || echo "❌ Simple print failed"

# Test 4: Try without dangerously-skip-permissions
echo "4️⃣ Testing without skip permissions..."
echo "Testing without skip" | timeout 10 claude --print || echo "❌ Without skip failed"

echo "🔍 Debug complete"