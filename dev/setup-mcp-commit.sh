#!/bin/bash
# Setup Claude Code MCP Server for /commit command

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MCP_SERVER="$SCRIPT_DIR/claude-commit-mcp-server.js"

echo "🚀 Setting up Claude Code MCP /commit integration..."

# Make MCP server executable
chmod +x "$MCP_SERVER"

echo ""
echo "📋 To add /commit as a native Claude Code tool:"
echo ""
echo "1. Add this to your ~/.claude/claude_desktop_config.json:"
echo ""
echo '{'
echo '  "mcpServers": {'
echo '    "claude-commit": {'
echo '      "command": "node",'
echo "      \"args\": [\"$MCP_SERVER\"],"
echo "      \"cwd\": \"$SCRIPT_DIR\""
echo '    }'
echo '  }'
echo '}'
echo ""
echo "2. Restart Claude Code"
echo ""
echo "3. Use /commit as a native tool in Claude Code sessions!"
echo ""
echo "⚡ This will add /commit as a built-in Claude Code tool that runs locally in 2-5 seconds."
echo ""
echo "🔧 Or run the simple install instead:"
echo "   ./install-global-commit.sh"