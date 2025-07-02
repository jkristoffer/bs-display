# MCP Setup Guide for BS Display Project

## Overview

This project is configured with a Model Context Protocol (MCP) server that provides seamless integration between Claude Code CLI and all project automation tools. The MCP server enables direct access to development tools through Claude Code's interface.

## Configuration

### .mcp.json Configuration

The project includes a `.mcp.json` file that automatically configures the MCP server when using Claude Code in this directory:

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

## Available Tools

The MCP server provides access to the following automation tools:

### Core Development Tools

1. **commit** - Intelligent git commit with auto-generated conventional commit messages
2. **type-check** - Run TypeScript type checking (`npm run check`)
3. **build** - Build the project for production (`npm run build`)
4. **dev-server** - Start the development server (`npm run dev`)

### Code Quality Tools

5. **code-review** - Run automated code review agent on specific files
   - Parameters: `file` (required) - Path to file to review
6. **performance-check** - Run performance analysis tools

### Content & SEO Tools

7. **seo-analyze** - Analyze SEO performance for blog posts and content
   - Parameters: `file` (required) - Path to content file to analyze
8. **blog-generate** - Generate new blog post using AI automation

## Usage in Claude Code

Once configured, these tools are available directly in Claude Code:

### Basic Usage
```
/commit
/type-check  
/build
```

### Tools with Parameters
```
/code-review --file src/components/Nav/Nav.tsx
/seo-analyze --file src/content/blog/my-post.md
```

### Development Workflow
```
# After making changes
/code-review --file [modified-file]
/type-check
/commit
```

## Security

- **Project approval required**: Claude Code prompts for approval before using project-scoped servers
- **Sandboxed execution**: Tools run in the project directory context
- **Version controlled**: Configuration is transparent and auditable

## Troubleshooting

### Reset Project Choices
If you need to reset MCP server approval choices:
```bash
claude mcp reset-project-choices
```

### Manual Testing
Test the MCP server directly:
```bash
node claude-commit-mcp-server.js
```

### Configuration Issues
1. Ensure `.mcp.json` is in the project root
2. Verify `claude-commit-mcp-server.js` exists and is executable
3. Check Node.js version compatibility (ES modules required)

## Integration with Project Standards

This MCP setup integrates seamlessly with the project's development standards:

- **Functional Programming**: All tools enforce functional programming standards
- **Code Review Agent**: Automated quality assurance on every change
- **SEO Optimization**: Built-in content analysis and optimization
- **Performance Tracking**: Continuous monitoring of development metrics

## Technical Implementation

The MCP server (`claude-commit-mcp-server.js`) implements the Model Context Protocol specification:

- **Protocol Version**: 2024-11-05
- **Transport**: stdio (standard input/output)
- **Tool Discovery**: Dynamic tool listing via `tools/list` method
- **Execution**: Secure tool execution via `tools/call` method
- **Error Handling**: Comprehensive error reporting and recovery

## Benefits

1. **Seamless Workflow**: Access all automation tools directly from Claude Code
2. **Consistent Environment**: Same tools available to all team members
3. **Reduced Context Switching**: No need to switch between Claude Code and terminal
4. **Enhanced Productivity**: Automated quality checks and code generation
5. **Standards Compliance**: Built-in enforcement of project standards

## Next Steps

After setting up MCP:

1. Try the `/commit` tool for your next git commit
2. Use `/code-review` after implementing new features
3. Run `/seo-analyze` on blog content before publishing
4. Explore all available tools with Claude Code's tool discovery

The MCP integration transforms Claude Code from a general AI assistant into a project-aware development companion with deep knowledge of your automation tools and workflows.