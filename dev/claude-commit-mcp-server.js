#!/usr/bin/env node
// Claude Code MCP Server for Fast Commit
// Adds /commit as a native Claude Code tool

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// MCP Server Protocol
class CommitMCPServer {
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
        name: "claude-code-commit",
        version: "1.0.0"
      }
    };
  }

  async listTools() {
    return { tools: this.tools };
  }

  async callTool(name, arguments_) {
    if (name === "commit") {
      try {
        const scriptPath = path.join(__dirname, 'scripts', 'commit');
        const { stdout, stderr } = await execAsync(scriptPath);
        
        return {
          content: [
            {
              type: "text",
              text: `⚡ Claude Code Fast Commit completed!\n\n${stdout}${stderr ? `\nWarnings: ${stderr}` : ''}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text", 
              text: `❌ Commit failed: ${error.message}\n\nMake sure you have unstaged changes and are in a git repository.`
            }
          ],
          isError: true
        };
      }
    }
    
    throw new Error(`Unknown tool: ${name}`);
  }
}

// MCP Protocol Handler
const server = new CommitMCPServer();

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