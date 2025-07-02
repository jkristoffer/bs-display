# Infrastructure Tools

## MCP (Model Context Protocol) Setup

### Overview
This project is configured with a Model Context Protocol (MCP) server that provides seamless integration between Claude Code CLI and all project automation tools.

### Configuration (.mcp.json)
```json
{
  "mcpServers": {
    "bs-display-automation": {
      "type": "stdio",
      "command": "node",
      "args": [
        "claude-commit-mcp-server.js"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### Key Features
- **Project-scoped**: Automatically available when using Claude Code in this project directory
- **Stdio transport**: Uses standard input/output for secure communication
- **Team collaboration**: Configuration is checked into version control for team consistency
- **Zero setup**: Works immediately after cloning the repository

### Available MCP Tools
1. **commit** - Intelligent git commit with auto-generated conventional commit messages
2. **type-check** - Run TypeScript type checking
3. **build** - Build the project for production
4. **dev-server** - Start the development server
5. **code-review** - Run automated code review agent on specific files

## VPS Management

### Mobile VPS Management Setup
Complete guide to manage your VPS from anywhere using GitHub Actions on your phone.

#### Initial Setup (One-time)

**Step 1: Set up DigitalOcean Secret**
1. Get your DigitalOcean API Token from https://cloud.digitalocean.com/account/api/tokens
2. Add Secret to GitHub: `DIGITALOCEAN_ACCESS_TOKEN`

**Step 2: Test the Setup**
1. Go to GitHub Actions tab
2. Run `🚀 VPS Management` workflow
3. Select `status` action to verify setup

#### Mobile Usage

**Quick Access URLs** (bookmark these):
```
https://github.com/YOUR_USERNAME/bs-display/actions/workflows/vps-management.yml
```

### VPS Scripts Directory (/vps-scripts/)
- **cleanup.sh** - Clean up VPS resources
- **cost-calculator.sh** - Calculate VPS costs  
- **create-base-snapshot.sh** - Create base VPS snapshot
- **create-minimal-test.sh** - Create minimal test environment
- **manage.sh** - General VPS management
- **provision-base.sh** - Provision base VPS
- **spin-up.sh** / **spin-up-no-wait.sh** - VPS deployment
- **test-dry-run.sh** - Test without actual provisioning
- **update-snapshot.sh** - Update existing snapshot

## PDF Analysis (MCP Server)

### Quick Commands
```bash
# Setup MCP server (one-time)
npm run mcp:pdf:setup

# Build/rebuild server
npm run mcp:pdf:build

# Test server functionality
npm run mcp:pdf:test

# Claude Code integration
npm run mcp:claude:add      # Add server to Claude Code
npm run mcp:claude:list     # List configured servers
npm run mcp:claude:remove   # Remove server
```

### Usage in Claude Code
Once configured, the PDF analyzer is available as:
- **Tool name**: `mcp__pdf-analyzer__analyze_pdf`
- **Analysis types**: extract, summarize, pricing, specifications
- **Example**: Analyze `quotation_for_85inch_smart_board.pdf` for pricing information

### Configuration
- **Server config**: `.mcp.json` (project-scoped, team-shared)
- **Source code**: `scripts/mcp-servers/pdf-analyzer/`
- **Dependencies**: Gemini CLI (must be in PATH)
