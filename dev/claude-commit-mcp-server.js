#!/usr/bin/env node
// Claude Code MCP Server for Project Automation Tools
// Provides all project automation tools as native Claude Code tools

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// MCP Server Protocol
class AutomationMCPServer {
  constructor() {
    this.tools = [
      {
        name: "commit",
        description: "Intelligently analyze git changes and create a commit with auto-generated conventional commit message. Runs in 2-5 seconds locally.",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      },
      {
        name: "code-review",
        description: "Run automated code review on a specific file",
        inputSchema: {
          type: "object",
          properties: {
            file: {
              type: "string",
              description: "Path to the file to review"
            }
          },
          required: ["file"]
        }
      },
      {
        name: "seo-analyze",
        description: "Analyze SEO for blog posts and content",
        inputSchema: {
          type: "object",
          properties: {
            file: {
              type: "string",
              description: "Path to the content file to analyze"
            }
          },
          required: ["file"]
        }
      },
      {
        name: "blog-generate",
        description: "Generate new blog post content",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      },
      {
        name: "type-check",
        description: "Run TypeScript type checking",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      },
      {
        name: "build",
        description: "Build the project for production",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      },
      {
        name: "dev-server",
        description: "Start the development server",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      },
      {
        name: "performance-check",
        description: "Run performance analysis tools",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      }
    ];
  }

  async initialize() {
    return {
      protocolVersion: "2024-11-05",
      capabilities: {
        tools: {}
      },
      serverInfo: {
        name: "claude-code-automation",
        version: "1.0.0"
      }
    };
  }

  async listTools() {
    return { tools: this.tools };
  }

  async callTool(name, arguments_) {
    try {
      let command;
      let successMessage;
      let errorMessage;

      switch (name) {
        case "commit":
          const scriptPath = path.join(__dirname, 'scripts', 'commit');
          command = scriptPath;
          successMessage = "⚡ Claude Code Fast Commit completed!";
          errorMessage = "❌ Commit failed";
          break;

        case "code-review":
          if (!arguments_.file) {
            throw new Error("File parameter is required for code-review");
          }
          command = `npm run tools:code-review -- --file "${arguments_.file}"`;
          successMessage = `✅ Code review completed for ${arguments_.file}`;
          errorMessage = `❌ Code review failed for ${arguments_.file}`;
          break;

        case "seo-analyze":
          if (!arguments_.file) {
            throw new Error("File parameter is required for seo-analyze");
          }
          command = `npm run tools:seo-analyze -- --file "${arguments_.file}"`;
          successMessage = `📊 SEO analysis completed for ${arguments_.file}`;
          errorMessage = `❌ SEO analysis failed for ${arguments_.file}`;
          break;

        case "blog-generate":
          command = "npm run tools:blog-generate";
          successMessage = "📝 Blog generation completed";
          errorMessage = "❌ Blog generation failed";
          break;

        case "type-check":
          command = "npm run check";
          successMessage = "🔍 TypeScript type checking completed";
          errorMessage = "❌ TypeScript type checking failed";
          break;

        case "build":
          command = "npm run build";
          successMessage = "🏗️ Build completed successfully";
          errorMessage = "❌ Build failed";
          break;

        case "dev-server":
          command = "npm run dev";
          successMessage = "🚀 Development server started";
          errorMessage = "❌ Failed to start development server";
          break;

        case "performance-check":
          command = "npm run tools:performance";
          successMessage = "⚡ Performance analysis completed";
          errorMessage = "❌ Performance analysis failed";
          break;

        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      const { stdout, stderr } = await execAsync(command, { cwd: __dirname });
      
      return {
        content: [
          {
            type: "text",
            text: `${successMessage}\n\n${stdout}${stderr ? `\nWarnings: ${stderr}` : ''}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text", 
            text: `${errorMessage || `❌ Tool ${name} failed`}: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
}

// MCP Protocol Handler
const server = new AutomationMCPServer();

process.stdin.on('data', async (data) => {
  try {
    const request = JSON.parse(data.toString());
    let response;

    switch (request.method) {
      case 'initialize':
        response = await server.initialize();
        break;
      case 'tools/list':
        response = await server.listTools();
        break;
      case 'tools/call':
        response = await server.callTool(request.params.name, request.params.arguments);
        break;
      default:
        throw new Error(`Unknown method: ${request.method}`);
    }

    console.log(JSON.stringify({
      jsonrpc: "2.0",
      id: request.id,
      result: response
    }));
  } catch (error) {
    console.log(JSON.stringify({
      jsonrpc: "2.0", 
      id: request.id,
      error: {
        code: -1,
        message: error.message
      }
    }));
  }
});

console.log(JSON.stringify({
  jsonrpc: "2.0",
  method: "initialized"
}));