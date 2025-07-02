#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { 
  CallToolRequestSchema,
  ListToolsRequestSchema,
  CallToolRequest,
  ListToolsRequest,
  CallToolResult,
  ListToolsResult
} from "@modelcontextprotocol/sdk/types.js";

import { PdfAnalyzerTool } from "./tools/pdf-analyzer.js";
import { ServerConfig } from "./types/index.js";

class PdfAnalyzerMCPServer {
  private server: Server;
  private tools: Map<string, PdfAnalyzerTool> = new Map();
  private config: ServerConfig;

  constructor() {
    this.config = {
      name: process.env.MCP_SERVER_NAME || "pdf-analyzer",
      version: process.env.MCP_SERVER_VERSION || "1.0.0",
      debug: process.env.DEBUG === 'true'
    };

    this.server = new Server({
      name: this.config.name,
      version: this.config.version
    }, {
      capabilities: {
        tools: {}
      }
    });

    this.initializeTools();
    this.setupHandlers();
  }

  private initializeTools() {
    const pdfAnalyzer = new PdfAnalyzerTool();
    this.tools.set(pdfAnalyzer.definition.name, pdfAnalyzer);
    
    this.log("Initialized tools", { 
      tools: Array.from(this.tools.keys()) 
    });
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, this.handleListTools.bind(this));
    this.server.setRequestHandler(CallToolRequestSchema, this.handleCallTool.bind(this));
  }

  private async handleListTools(request: ListToolsRequest): Promise<ListToolsResult> {
    this.log("Handling list tools request");
    
    const tools = Array.from(this.tools.values()).map(tool => tool.definition);
    
    return { tools };
  }

  private async handleCallTool(request: CallToolRequest): Promise<CallToolResult> {
    const { name, arguments: args } = request.params;
    
    this.log("Handling tool call", { name, args });

    const tool = this.tools.get(name);
    if (!tool) {
      const error = `Unknown tool: ${name}`;
      this.log("Tool not found", { name, available: Array.from(this.tools.keys()) });
      throw new Error(error);
    }

    try {
      const result = await tool.execute(args);
      this.log("Tool execution completed", { name, success: !result.isError });
      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log("Tool execution failed", { name, error: errorMessage });
      throw error;
    }
  }

  private log(message: string, data?: unknown): void {
    if (this.config.debug) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        server: this.config.name,
        message,
        data
      };
      // Write to stderr to avoid interfering with MCP communication
      console.error(JSON.stringify(logEntry));
    }
  }

  async start() {
    try {
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      
      this.log("MCP server started", {
        name: this.config.name,
        version: this.config.version,
        tools: Array.from(this.tools.keys())
      });
      
      // Don't log to stdout as it interferes with MCP protocol
      console.error(`${this.config.name} v${this.config.version} MCP server running on stdio`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Failed to start MCP server: ${errorMessage}`);
      process.exit(1);
    }
  }

  // Graceful shutdown
  setupGracefulShutdown() {
    const shutdown = (signal: string) => {
      this.log("Received shutdown signal", { signal });
      console.error(`Received ${signal}. Shutting down gracefully...`);
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  }
}

// Start the server
async function main() {
  const server = new PdfAnalyzerMCPServer();
  server.setupGracefulShutdown();
  await server.start();
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});