#!/bin/bash
# Setup script to create /commit alias for Claude Code Fast Commit

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMMIT_SCRIPT="$SCRIPT_DIR/scripts/commit"

echo "🚀 Setting up Claude Code Fast Commit alias..."

# Check if the commit script exists
if [ ! -f "$COMMIT_SCRIPT" ]; then
  echo "❌ Error: commit script not found at $COMMIT_SCRIPT"
  exit 1
fi

# Make sure script is executable
chmod +x "$COMMIT_SCRIPT"

echo ""
echo "✅ Claude Code Fast Commit is ready!"
echo ""
echo "📋 Usage options:"
echo "1. Direct call:     ./scripts/commit"
echo "2. From anywhere:   $COMMIT_SCRIPT"
echo ""
echo "🔧 To create a global /commit alias, add this to your ~/.bashrc or ~/.zshrc:"
echo "alias /commit='$COMMIT_SCRIPT'"
echo ""
echo "💡 Or create a symbolic link:"
echo "sudo ln -sf '$COMMIT_SCRIPT' /usr/local/bin/commit"
echo ""
echo "⚡ Expected performance: 2-5 seconds (vs 45-90s GitHub Actions)"
echo "🎯 Features: Intelligent commit messages, file filtering, conventional commits"