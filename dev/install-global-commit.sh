#!/bin/bash
# Install Claude Code Fast Commit as global /commit command

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMMIT_SCRIPT="$SCRIPT_DIR/scripts/commit"

echo "🚀 Installing Claude Code Fast Commit globally..."

# Check if the commit script exists
if [ ! -f "$COMMIT_SCRIPT" ]; then
  echo "❌ Error: commit script not found at $COMMIT_SCRIPT"
  exit 1
fi

# Make sure script is executable
chmod +x "$COMMIT_SCRIPT"

# Create global symlink
if [ -w "/usr/local/bin" ]; then
  sudo ln -sf "$COMMIT_SCRIPT" /usr/local/bin/commit
  echo "✅ Global 'commit' command installed to /usr/local/bin/commit"
else
  # Fallback to user bin
  mkdir -p ~/bin
  ln -sf "$COMMIT_SCRIPT" ~/bin/commit
  echo "✅ User 'commit' command installed to ~/bin/commit"
  echo "💡 Add ~/bin to your PATH if not already there:"
  echo "   echo 'export PATH=\$HOME/bin:\$PATH' >> ~/.zshrc"
fi

echo ""
echo "🎯 Usage from anywhere:"
echo "   commit  # Run Claude Code fast commit"
echo ""
echo "📝 Or in Claude Code sessions:"
echo "   /commit  # Same as above"
echo ""
echo "⚡ Performance: 2-5 seconds vs 45-90s GitHub Actions"