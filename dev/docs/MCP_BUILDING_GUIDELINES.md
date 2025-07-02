# Model Context Protocol (MCP) - Building & Usage Guidelines

**Version:** 1.0  
**Last Updated:** July 2, 2025  
**Audience:** Developers, DevOps Engineers, AI Application Builders

---

## Table of Contents

1. [Quick Start Guide](#1-quick-start-guide)
2. [Development Environment Setup](#2-development-environment-setup)
3. [MCP Server Development](#3-mcp-server-development)
4. [Claude Code Integration](#4-claude-code-integration)
5. [Security Best Practices](#5-security-best-practices)
6. [Testing and Debugging](#6-testing-and-debugging)
7. [Deployment Strategies](#7-deployment-strategies)
8. [Common Patterns](#8-common-patterns)
9. [Troubleshooting Guide](#9-troubleshooting-guide)
10. [Production Considerations](#10-production-considerations)

---

## 1. Quick Start Guide

### 1.1 Prerequisites Checklist
- [ ] Node.js 18+ installed
- [ ] Claude Code CLI installed
- [ ] Basic understanding of TypeScript/JavaScript
- [ ] Access to external APIs/services (if integrating)

### 1.2 30-Second MCP Server
```bash
# Install MCP SDK
npm install @modelcontextprotocol/sdk

# Create basic server
cat > mcp-server.js << 'EOF'
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({ name: "hello-mcp", version: "1.0.0" }, 
  { capabilities: { tools: {} } });

const transport = new StdioServerTransport();
await server.connect(transport);
EOF

# Add to Claude Code
claude mcp add hello-server node mcp-server.js
```

### 1.3 Immediate Verification
```bash
# Check server status
claude mcp list

# Test in Claude Code
claude-code
# Use /mcp command to verify connection
```

---

## 2. Development Environment Setup

### 2.1 Project Structure (Recommended)
```
my-mcp-server/
├── src/
│   ├── index.ts              # Main server entry
│   ├── tools/                # Tool implementations
│   │   ├── analyzer.ts
│   │   └── converter.ts
│   ├── resources/            # Resource handlers
│   ├── prompts/              # Prompt templates
│   └── types/                # TypeScript type definitions
├── dist/                     # Compiled output
├── package.json
├── tsconfig.json
├── .mcp.json                 # Project-scope configuration
└── README.md
```

### 2.2 Essential Dependencies
```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^latest",
    "zod": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^18.0.0",
    "ts-node": "^10.0.0"
  }
}
```

### 2.3 TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 3. MCP Server Development

### 3.1 Server Architecture Pattern

#### Core Server Setup
```typescript
// src/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { 
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ListPromptsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";

class MCPServer {
  private server: Server;

  constructor() {
    this.server = new Server({
      name: process.env.MCP_SERVER_NAME || "custom-mcp-server",
      version: process.env.MCP_SERVER_VERSION || "1.0.0"
    }, {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {}
      }
    });

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, this.listTools.bind(this));
    this.server.setRequestHandler(CallToolRequestSchema, this.callTool.bind(this));
    this.server.setRequestHandler(ListResourcesRequestSchema, this.listResources.bind(this));
    this.server.setRequestHandler(ListPromptsRequestSchema, this.listPrompts.bind(this));
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error(`${this.server.name} MCP server running on stdio`);
  }
}

const server = new MCPServer();
server.start().catch(console.error);
```

### 3.2 Tool Development Pattern

#### Tool Definition Framework
```typescript
// src/tools/base-tool.ts
import { z } from "zod";

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: object;
}

export interface ToolResult {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}

export abstract class BaseTool {
  abstract get definition(): ToolDefinition;
  abstract execute(args: unknown): Promise<ToolResult>;

  protected validateInput<T>(schema: z.ZodSchema<T>, input: unknown): T {
    try {
      return schema.parse(input);
    } catch (error) {
      throw new Error(`Invalid input: ${error.message}`);
    }
  }

  protected createSuccessResult(text: string): ToolResult {
    return { content: [{ type: "text", text }] };
  }

  protected createErrorResult(error: string | Error): ToolResult {
    const message = error instanceof Error ? error.message : error;
    return { 
      content: [{ type: "text", text: `Error: ${message}` }],
      isError: true 
    };
  }
}
```

#### Example Tool Implementation
```typescript
// src/tools/pdf-analyzer.ts
import { BaseTool, ToolDefinition, ToolResult } from "./base-tool.js";
import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const PdfAnalyzerInputSchema = z.object({
  file_path: z.string().min(1, "File path is required"),
  analysis_type: z.enum(["extract", "summarize", "pricing", "specifications"]).default("extract"),
  custom_prompt: z.string().optional()
});

export class PdfAnalyzerTool extends BaseTool {
  get definition(): ToolDefinition {
    return {
      name: "analyze_pdf",
      description: "Analyze PDF files using Gemini CLI with various analysis types",
      inputSchema: {
        type: "object",
        properties: {
          file_path: {
            type: "string",
            description: "Path to the PDF file to analyze"
          },
          analysis_type: {
            type: "string",
            enum: ["extract", "summarize", "pricing", "specifications"],
            default: "extract",
            description: "Type of analysis to perform on the PDF"
          },
          custom_prompt: {
            type: "string",
            description: "Custom prompt to override default analysis prompt"
          }
        },
        required: ["file_path"]
      }
    };
  }

  async execute(args: unknown): Promise<ToolResult> {
    try {
      const { file_path, analysis_type, custom_prompt } = this.validateInput(
        PdfAnalyzerInputSchema, 
        args
      );

      // Build analysis prompt
      const prompt = this.buildAnalysisPrompt(file_path, analysis_type, custom_prompt);
      
      // Execute Gemini CLI
      const { stdout, stderr } = await execAsync(`gemini -p "${prompt}"`);
      
      if (stderr) {
        console.error(`Gemini CLI warning: ${stderr}`);
      }

      return this.createSuccessResult(stdout.trim());
    } catch (error) {
      return this.createErrorResult(error);
    }
  }

  private buildAnalysisPrompt(filePath: string, analysisType: string, customPrompt?: string): string {
    let basePrompt = `I have a PDF file called '${filePath}' in my current directory. `;
    
    if (customPrompt) {
      return basePrompt + customPrompt;
    }

    const analysisPrompts = {
      extract: "Extract all key information, text content, and important details from this PDF document.",
      summarize: "Provide a comprehensive summary of the main points, conclusions, and key takeaways from this PDF.",
      pricing: "Focus on extracting pricing information, costs, financial details, and any monetary values mentioned in this PDF.",
      specifications: "Extract technical specifications, product details, features, and any technical documentation from this PDF."
    };

    return basePrompt + analysisPrompts[analysisType];
  }
}
```

### 3.3 Resource Management Pattern

#### Resource Definition
```typescript
// src/resources/resource-manager.ts
export interface ResourceDefinition {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export class ResourceManager {
  private resources: Map<string, ResourceDefinition> = new Map();

  registerResource(resource: ResourceDefinition) {
    this.resources.set(resource.uri, resource);
  }

  listResources(): ResourceDefinition[] {
    return Array.from(this.resources.values());
  }

  async getResource(uri: string): Promise<string> {
    const resource = this.resources.get(uri);
    if (!resource) {
      throw new Error(`Resource not found: ${uri}`);
    }
    
    // Implement resource retrieval logic
    return this.fetchResourceContent(uri);
  }

  private async fetchResourceContent(uri: string): Promise<string> {
    // Implementation depends on resource type
    // Could be file system, database, API, etc.
    throw new Error("Resource fetching not implemented");
  }
}
```

### 3.4 Prompt Template System

#### Prompt Definition
```typescript
// src/prompts/prompt-manager.ts
export interface PromptDefinition {
  name: string;
  description: string;
  arguments?: Array<{
    name: string;
    description: string;
    required?: boolean;
  }>;
}

export class PromptManager {
  private prompts: Map<string, PromptDefinition> = new Map();

  registerPrompt(prompt: PromptDefinition) {
    this.prompts.set(prompt.name, prompt);
  }

  listPrompts(): PromptDefinition[] {
    return Array.from(this.prompts.values());
  }

  async getPrompt(name: string, args?: Record<string, string>): Promise<string> {
    const prompt = this.prompts.get(name);
    if (!prompt) {
      throw new Error(`Prompt not found: ${name}`);
    }

    return this.renderPrompt(prompt, args);
  }

  private renderPrompt(prompt: PromptDefinition, args?: Record<string, string>): string {
    // Simple template rendering - could use more sophisticated template engine
    let template = this.getPromptTemplate(prompt.name);
    
    if (args) {
      Object.entries(args).forEach(([key, value]) => {
        template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });
    }

    return template;
  }

  private getPromptTemplate(name: string): string {
    // Store templates in files, database, or inline
    const templates = {
      quick_pdf_summary: "Provide a quick summary of the PDF file: {{file_path}}",
      detailed_analysis: "Perform detailed analysis of {{file_path}} focusing on {{focus_area}}"
    };

    return templates[name] || `Template not found for: ${name}`;
  }
}
```

---

## 4. Claude Code Integration

### 4.1 Configuration Management

#### Project-Level Configuration (.mcp.json)
```json
{
  "mcpServers": {
    "pdf-analyzer": {
      "type": "stdio",
      "command": "node",
      "args": ["./dist/index.js"],
      "env": {
        "MCP_SERVER_NAME": "PDF Analyzer",
        "MCP_SERVER_VERSION": "1.0.0",
        "DEBUG": "false"
      }
    },
    "remote-api-server": {
      "type": "sse",
      "url": "https://your-api.com/mcp",
      "headers": {
        "Authorization": "Bearer {{API_TOKEN}}"
      }
    }
  }
}
```

#### User-Level Configuration (~/.claude.json)
```json
{
  "mcpServers": {
    "global-utilities": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@your-org/mcp-utilities"],
      "env": {
        "HOME_DIR": "{{HOME}}"
      }
    }
  }
}
```

### 4.2 Server Registration Workflow

#### Development Workflow
```bash
# 1. Build your server
npm run build

# 2. Test locally
node dist/index.js

# 3. Add to Claude Code (local scope for development)
claude mcp add pdf-analyzer -s local -- node dist/index.js

# 4. Test integration
claude-code
# In Claude Code, use /mcp to check status
# Use your tools: mcp__pdf-analyzer__analyze_pdf
```

#### Team Deployment Workflow
```bash
# 1. Create project configuration
cat > .mcp.json << 'EOF'
{
  "mcpServers": {
    "pdf-analyzer": {
      "type": "stdio",
      "command": "node",
      "args": ["./scripts/mcp-servers/pdf-analyzer/dist/index.js"]
    }
  }
}
EOF

# 2. Commit to version control
git add .mcp.json
git commit -m "Add PDF analyzer MCP server configuration"

# 3. Team members pull and approve
# Claude Code will prompt for approval on first use
```

### 4.3 Advanced Configuration Patterns

#### Environment-Specific Configuration
```bash
# Development environment
claude mcp add api-server -e NODE_ENV=development -e API_URL=http://localhost:3000

# Production environment  
claude mcp add api-server -e NODE_ENV=production -e API_URL=https://api.production.com
```

#### Conditional Server Loading
```json
{
  "mcpServers": {
    "dev-tools": {
      "type": "stdio",
      "command": "sh",
      "args": ["-c", "if [ \"$NODE_ENV\" = \"development\" ]; then node dev-tools.js; else echo 'Dev tools disabled'; fi"]
    }
  }
}
```

---

## 5. Security Best Practices

### 5.1 Input Validation and Sanitization

#### Comprehensive Input Validation
```typescript
import { z } from "zod";
import path from "path";

// File path validation
const FilePathSchema = z.string()
  .min(1, "File path cannot be empty")
  .refine(
    (filePath) => {
      // Prevent directory traversal
      const resolved = path.resolve(filePath);
      const cwd = process.cwd();
      return resolved.startsWith(cwd);
    },
    { message: "File path must be within current directory" }
  );

// Command injection prevention
const SafeStringSchema = z.string()
  .refine(
    (str) => !/[;&|`$(){}[\]\\]/.test(str),
    { message: "String contains potentially dangerous characters" }
  );

// API parameter validation
const ApiParameterSchema = z.object({
  query: z.string().max(500, "Query too long"),
  limit: z.number().min(1).max(100, "Limit must be between 1 and 100"),
  apiKey: z.string().regex(/^[a-zA-Z0-9_-]+$/, "Invalid API key format")
});
```

#### Safe Command Execution
```typescript
import { spawn, SpawnOptions } from "child_process";

export class SafeCommandExecutor {
  private readonly allowedCommands = new Set(['gemini', 'pdftotext', 'convert']);
  private readonly maxTimeout = 30000; // 30 seconds

  async execute(command: string, args: string[], options: Partial<SpawnOptions> = {}): Promise<string> {
    // Validate command
    if (!this.allowedCommands.has(command)) {
      throw new Error(`Command not allowed: ${command}`);
    }

    // Sanitize arguments
    const sanitizedArgs = args.map(arg => this.sanitizeArgument(arg));

    return new Promise((resolve, reject) => {
      const child = spawn(command, sanitizedArgs, {
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: this.maxTimeout,
        ...options
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(`Command failed with code ${code}: ${stderr}`));
        }
      });

      child.on('error', reject);
    });
  }

  private sanitizeArgument(arg: string): string {
    // Remove or escape dangerous characters
    return arg.replace(/[;&|`$(){}[\]\\]/g, '');
  }
}
```

### 5.2 Authentication and Authorization

#### API Key Management
```typescript
export class SecureConfigManager {
  private readonly requiredEnvVars = ['GEMINI_API_KEY', 'SERVICE_URL'];

  constructor() {
    this.validateEnvironment();
  }

  private validateEnvironment() {
    const missing = this.requiredEnvVars.filter(env => !process.env[env]);
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  getSecureConfig(): Record<string, string> {
    return {
      geminiApiKey: process.env.GEMINI_API_KEY!,
      serviceUrl: process.env.SERVICE_URL!,
      // Never log or return raw secrets
    };
  }

  // Mask sensitive data in logs
  maskSecrets(text: string): string {
    const config = this.getSecureConfig();
    let masked = text;
    
    Object.values(config).forEach(secret => {
      if (secret.length > 8) {
        const maskedSecret = secret.substring(0, 4) + '****' + secret.substring(secret.length - 4);
        masked = masked.replace(new RegExp(secret, 'g'), maskedSecret);
      }
    });

    return masked;
  }
}
```

#### Permission-Based Tool Access
```typescript
export enum Permission {
  READ_FILES = 'files:read',
  WRITE_FILES = 'files:write',
  EXECUTE_COMMANDS = 'commands:execute',
  ACCESS_NETWORK = 'network:access'
}

export class PermissionManager {
  private readonly userPermissions: Set<Permission>;

  constructor(permissions: Permission[] = []) {
    this.userPermissions = new Set(permissions);
  }

  checkPermission(required: Permission): void {
    if (!this.userPermissions.has(required)) {
      throw new Error(`Permission denied: ${required}`);
    }
  }

  hasPermission(permission: Permission): boolean {
    return this.userPermissions.has(permission);
  }
}

// Usage in tools
export class SecurePdfAnalyzer extends BaseTool {
  constructor(private permissions: PermissionManager) {
    super();
  }

  async execute(args: unknown): Promise<ToolResult> {
    // Check required permissions
    this.permissions.checkPermission(Permission.READ_FILES);
    this.permissions.checkPermission(Permission.EXECUTE_COMMANDS);

    // Continue with secure execution...
  }
}
```

### 5.3 Data Protection

#### Secure Temporary File Handling
```typescript
import { randomBytes } from 'crypto';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

export class SecureTempFileManager {
  private readonly tempFiles: Set<string> = new Set();

  async createTempFile(content: string, extension: string = '.tmp'): Promise<string> {
    const fileName = randomBytes(16).toString('hex') + extension;
    const filePath = join(tmpdir(), fileName);
    
    await fs.writeFile(filePath, content, { mode: 0o600 }); // Owner read/write only
    this.tempFiles.add(filePath);
    
    return filePath;
  }

  async cleanup(): Promise<void> {
    for (const filePath of this.tempFiles) {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error(`Failed to cleanup temp file ${filePath}:`, error);
      }
    }
    this.tempFiles.clear();
  }

  // Ensure cleanup on process exit
  setupCleanupHandlers(): void {
    process.on('exit', () => this.cleanup());
    process.on('SIGINT', () => this.cleanup());
    process.on('SIGTERM', () => this.cleanup());
  }
}
```

---

## 6. Testing and Debugging

### 6.1 Unit Testing Framework

#### Tool Testing Pattern
```typescript
// tests/tools/pdf-analyzer.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PdfAnalyzerTool } from '../../src/tools/pdf-analyzer.js';

describe('PdfAnalyzerTool', () => {
  let tool: PdfAnalyzerTool;

  beforeEach(() => {
    tool = new PdfAnalyzerTool();
  });

  describe('definition', () => {
    it('should have correct tool definition', () => {
      const definition = tool.definition;
      
      expect(definition.name).toBe('analyze_pdf');
      expect(definition.description).toContain('Analyze PDF files');
      expect(definition.inputSchema.properties).toHaveProperty('file_path');
    });
  });

  describe('execute', () => {
    it('should validate input correctly', async () => {
      const result = await tool.execute({});
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('File path is required');
    });

    it('should handle valid input', async () => {
      // Mock external dependencies for testing
      const mockExecAsync = vi.fn().mockResolvedValue({ stdout: 'Analysis result', stderr: '' });
      
      const result = await tool.execute({
        file_path: 'test.pdf',
        analysis_type: 'extract'
      });
      
      expect(result.isError).toBeFalsy();
      expect(result.content[0].text).toContain('Analysis result');
    });
  });
});
```

#### Integration Testing
```typescript
// tests/integration/mcp-server.test.ts
import { MCPServer } from '../../src/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

describe('MCP Server Integration', () => {
  let server: MCPServer;

  beforeEach(async () => {
    server = new MCPServer();
    // Setup test transport
  });

  it('should handle tool list requests', async () => {
    const tools = await server.listTools();
    
    expect(tools).toBeInstanceOf(Array);
    expect(tools.length).toBeGreaterThan(0);
  });

  it('should execute tools successfully', async () => {
    const result = await server.callTool('analyze_pdf', {
      file_path: 'test-fixtures/sample.pdf'
    });
    
    expect(result.content).toBeDefined();
    expect(result.isError).toBeFalsy();
  });
});
```

### 6.2 Debugging Strategies

#### Structured Logging
```typescript
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export class Logger {
  constructor(private level: LogLevel = LogLevel.INFO) {}

  debug(message: string, context?: Record<string, unknown>) {
    if (this.level <= LogLevel.DEBUG) {
      this.log('DEBUG', message, context);
    }
  }

  info(message: string, context?: Record<string, unknown>) {
    if (this.level <= LogLevel.INFO) {
      this.log('INFO', message, context);
    }
  }

  warn(message: string, context?: Record<string, unknown>) {
    if (this.level <= LogLevel.WARN) {
      this.log('WARN', message, context);
    }
  }

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.log('ERROR', message, { ...context, error: error?.message, stack: error?.stack });
  }

  private log(level: string, message: string, context?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context
    };

    // Write to stderr to avoid interfering with MCP communication
    console.error(JSON.stringify(logEntry));
  }
}
```

#### Development Mode Features
```typescript
export class DevelopmentServer extends MCPServer {
  constructor() {
    super();
    
    if (process.env.NODE_ENV === 'development') {
      this.enableDevelopmentFeatures();
    }
  }

  private enableDevelopmentFeatures() {
    // Request/response logging
    this.server.onRequest = (request) => {
      this.logger.debug('Incoming request', { 
        method: request.method, 
        params: request.params 
      });
    };

    // Performance monitoring
    this.server.setRequestHandler = ((original) => {
      return (schema, handler) => {
        const wrappedHandler = async (request) => {
          const start = Date.now();
          try {
            const result = await handler(request);
            const duration = Date.now() - start;
            this.logger.debug('Request completed', { 
              method: request.method, 
              duration,
              success: true 
            });
            return result;
          } catch (error) {
            const duration = Date.now() - start;
            this.logger.error('Request failed', error, { 
              method: request.method, 
              duration 
            });
            throw error;
          }
        };
        return original.call(this.server, schema, wrappedHandler);
      };
    })(this.server.setRequestHandler.bind(this.server));
  }
}
```

### 6.3 Testing with Claude Code

#### Local Testing Workflow
```bash
# 1. Start server in debug mode
NODE_ENV=development DEBUG=true node dist/index.js &
SERVER_PID=$!

# 2. Add to Claude Code with debug flags
claude mcp add test-server -s local -e DEBUG=true -- node dist/index.js

# 3. Test in interactive mode
claude-code --debug

# 4. Cleanup
kill $SERVER_PID
claude mcp remove test-server
```

#### Automated Testing Script
```bash
#!/bin/bash
# test-mcp-integration.sh

set -e

echo "Building MCP server..."
npm run build

echo "Starting test server..."
node dist/index.js &
SERVER_PID=$!

# Give server time to start
sleep 2

echo "Testing server responses..."
# Test tool listing
echo '{"method": "tools/list", "id": 1}' | node dist/index.js

# Test tool execution
echo '{"method": "tools/call", "params": {"name": "analyze_pdf", "arguments": {"file_path": "test.pdf"}}, "id": 2}' | node dist/index.js

echo "Cleaning up..."
kill $SERVER_PID

echo "Integration test completed successfully!"
```

---

## 7. Deployment Strategies

### 7.1 Local Development Deployment

#### Development Script
```bash
#!/bin/bash
# scripts/dev-setup.sh

set -e

echo "Setting up MCP development environment..."

# Build server
npm run build

# Create development configuration
cat > .mcp.dev.json << 'EOF'
{
  "mcpServers": {
    "pdf-analyzer-dev": {
      "type": "stdio",
      "command": "node",
      "args": ["./dist/index.js"],
      "env": {
        "NODE_ENV": "development",
        "DEBUG": "true",
        "LOG_LEVEL": "DEBUG"
      }
    }
  }
}
EOF

# Add to Claude Code
claude mcp add pdf-analyzer-dev -s local -- node ./dist/index.js

echo "Development environment ready!"
echo "Start Claude Code and use: mcp__pdf-analyzer-dev__analyze_pdf"
```

### 7.2 Team/Project Deployment

#### Project Configuration Template
```json
{
  "mcpServers": {
    "pdf-analyzer": {
      "type": "stdio",
      "command": "node",
      "args": ["./scripts/mcp-servers/pdf-analyzer/dist/index.js"],
      "env": {
        "NODE_ENV": "production",
        "LOG_LEVEL": "INFO"
      }
    }
  }
}
```

#### Team Onboarding Script
```bash
#!/bin/bash
# scripts/team-setup.sh

echo "Setting up team MCP environment..."

# Check prerequisites
command -v claude >/dev/null 2>&1 || { echo "Claude Code CLI required"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js required"; exit 1; }

# Install dependencies
npm install

# Build all MCP servers
npm run build:mcp-servers

# Verify configuration
if [ -f ".mcp.json" ]; then
    echo "Project MCP configuration found"
    claude mcp list --scope project
else
    echo "No project MCP configuration found"
    echo "Please ensure .mcp.json is committed to the repository"
    exit 1
fi

echo "Team environment setup complete!"
echo "MCP servers will be available after Claude Code approval"
```

### 7.3 Remote/Cloud Deployment

#### Docker Container Setup
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY dist/ ./dist/
COPY public/ ./public/

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S mcp -u 1001
USER mcp

# Expose MCP server port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "dist/server.js"]
```

#### Cloud Deployment Configuration
```yaml
# docker-compose.yml
version: '3.8'

services:
  pdf-analyzer-mcp:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    volumes:
      - ./uploads:/app/uploads:ro
    restart: unless-stopped
    networks:
      - mcp-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - pdf-analyzer-mcp
    networks:
      - mcp-network

networks:
  mcp-network:
    driver: bridge
```

#### Remote Server Implementation
```typescript
// src/remote-server.ts
import express from 'express';
import { MCPServer } from './mcp-server.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// MCP endpoint
app.post('/mcp', async (req, res) => {
  try {
    const mcpServer = new MCPServer();
    const result = await mcpServer.handleRequest(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`MCP server running on port ${port}`);
});
```

### 7.4 Desktop Extension Package

#### Desktop Extension Configuration
```bash
# Initialize desktop extension
npx @anthropic-ai/dxt init

# This creates:
# - dxt.json (extension configuration)
# - package/ (extension files)
```

#### Extension Configuration (dxt.json)
```json
{
  "name": "PDF Analyzer MCP",
  "version": "1.0.0",
  "description": "Analyze PDF files using Gemini CLI",
  "author": "Your Organization",
  "homepage": "https://github.com/your-org/pdf-analyzer-mcp",
  "mcp": {
    "command": "node",
    "args": ["index.js"],
    "env": {}
  },
  "files": [
    "index.js",
    "package.json",
    "README.md"
  ]
}
```

#### Package and Distribute
```bash
# Package extension
npx @anthropic-ai/dxt pack

# This creates a .dxt file for distribution
# Users can install with one click in Claude Desktop
```

---

## 8. Common Patterns

### 8.1 Multi-Tool Server Pattern

#### Organized Tool Registry
```typescript
// src/tools/tool-registry.ts
import { BaseTool } from './base-tool.js';
import { PdfAnalyzerTool } from './pdf-analyzer.js';
import { FileConverterTool } from './file-converter.js';
import { ApiQueryTool } from './api-query.js';

export class ToolRegistry {
  private tools: Map<string, BaseTool> = new Map();

  constructor() {
    this.registerDefaultTools();
  }

  private registerDefaultTools() {
    this.register(new PdfAnalyzerTool());
    this.register(new FileConverterTool());
    this.register(new ApiQueryTool());
  }

  register(tool: BaseTool) {
    this.tools.set(tool.definition.name, tool);
  }

  getTool(name: string): BaseTool | undefined {
    return this.tools.get(name);
  }

  listTools() {
    return Array.from(this.tools.values()).map(tool => tool.definition);
  }

  async executeTool(name: string, args: unknown) {
    const tool = this.getTool(name);
    if (!tool) {
      throw new Error(`Tool not found: ${name}`);
    }
    return tool.execute(args);
  }
}
```

### 8.2 Configuration-Driven Server Pattern

#### Dynamic Server Configuration
```typescript
// src/config/server-config.ts
export interface ServerConfig {
  name: string;
  version: string;
  tools: ToolConfig[];
  resources: ResourceConfig[];
  prompts: PromptConfig[];
}

export interface ToolConfig {
  name: string;
  enabled: boolean;
  implementation: string;
  configuration: Record<string, unknown>;
}

export class ConfigurableServer {
  constructor(config: ServerConfig) {
    this.initializeFromConfig(config);
  }

  private initializeFromConfig(config: ServerConfig) {
    // Dynamically load and configure tools
    config.tools.forEach(toolConfig => {
      if (toolConfig.enabled) {
        const ToolClass = this.loadToolClass(toolConfig.implementation);
        const tool = new ToolClass(toolConfig.configuration);
        this.toolRegistry.register(tool);
      }
    });
  }

  private loadToolClass(implementation: string) {
    // Dynamic import based on configuration
    const toolMap = {
      'pdf-analyzer': () => import('./tools/pdf-analyzer.js'),
      'file-converter': () => import('./tools/file-converter.js'),
      'api-query': () => import('./tools/api-query.js')
    };

    return toolMap[implementation]?.() || throw new Error(`Unknown tool: ${implementation}`);
  }
}
```

### 8.3 Plugin Architecture Pattern

#### Plugin Interface
```typescript
// src/plugins/plugin-interface.ts
export interface MCPPlugin {
  name: string;
  version: string;
  initialize(server: MCPServer): Promise<void>;
  teardown(): Promise<void>;
}

export abstract class BasePlugin implements MCPPlugin {
  abstract name: string;
  abstract version: string;

  abstract initialize(server: MCPServer): Promise<void>;
  
  async teardown(): Promise<void> {
    // Default implementation
  }

  protected registerTool(server: MCPServer, tool: BaseTool) {
    server.toolRegistry.register(tool);
  }

  protected registerResource(server: MCPServer, resource: ResourceDefinition) {
    server.resourceManager.registerResource(resource);
  }
}
```

#### Example Plugin Implementation
```typescript
// src/plugins/pdf-plugin.ts
export class PdfPlugin extends BasePlugin {
  name = 'pdf-plugin';
  version = '1.0.0';

  async initialize(server: MCPServer): Promise<void> {
    // Register PDF-related tools
    this.registerTool(server, new PdfAnalyzerTool());
    this.registerTool(server, new PdfConverterTool());
    this.registerTool(server, new PdfMetadataTool());

    // Register PDF resources
    this.registerResource(server, {
      uri: 'pdf://recent-analyses',
      name: 'Recent PDF Analyses',
      mimeType: 'application/json'
    });

    console.log(`${this.name} v${this.version} initialized`);
  }

  async teardown(): Promise<void> {
    // Cleanup plugin resources
    console.log(`${this.name} teardown complete`);
  }
}
```

### 8.4 State Management Pattern

#### Server State Manager
```typescript
// src/state/state-manager.ts
export interface ServerState {
  activeOperations: Map<string, OperationStatus>;
  resourceCache: Map<string, CachedResource>;
  userSessions: Map<string, UserSession>;
}

export interface OperationStatus {
  id: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: Date;
  progress?: number;
  result?: unknown;
  error?: string;
}

export class StateManager {
  private state: ServerState = {
    activeOperations: new Map(),
    resourceCache: new Map(),
    userSessions: new Map()
  };

  // Operation tracking
  startOperation(type: string): string {
    const id = this.generateOperationId();
    this.state.activeOperations.set(id, {
      id,
      type,
      status: 'pending',
      startTime: new Date()
    });
    return id;
  }

  updateOperation(id: string, updates: Partial<OperationStatus>) {
    const operation = this.state.activeOperations.get(id);
    if (operation) {
      Object.assign(operation, updates);
    }
  }

  completeOperation(id: string, result?: unknown, error?: string) {
    this.updateOperation(id, {
      status: error ? 'failed' : 'completed',
      result,
      error
    });
  }

  // Resource caching
  cacheResource(uri: string, content: string, ttl: number = 300000) {
    this.state.resourceCache.set(uri, {
      content,
      cachedAt: new Date(),
      ttl
    });
  }

  getCachedResource(uri: string): string | null {
    const cached = this.state.resourceCache.get(uri);
    if (!cached) return null;

    const isExpired = Date.now() - cached.cachedAt.getTime() > cached.ttl;
    if (isExpired) {
      this.state.resourceCache.delete(uri);
      return null;
    }

    return cached.content;
  }

  private generateOperationId(): string {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

---

## 9. Troubleshooting Guide

### 9.1 Common Issues and Solutions

#### Server Connection Issues
```bash
# Problem: Server won't start
# Solution: Check server logs and configuration

# Debug server startup
DEBUG=true node dist/index.js

# Check Claude Code server status
claude mcp list
claude mcp remove problematic-server
claude mcp add problematic-server --debug

# Verify server configuration
cat ~/.claude.json | jq '.mcpServers'
```

#### Tool Execution Failures
```typescript
// Problem: Tools failing silently
// Solution: Add comprehensive error handling

async execute(args: unknown): Promise<ToolResult> {
  try {
    // Validate input
    const validatedArgs = this.validateInput(schema, args);
    
    // Log operation start
    console.error(`Starting tool execution: ${this.definition.name}`, validatedArgs);
    
    const result = await this.performOperation(validatedArgs);
    
    // Log successful result
    console.error(`Tool execution completed: ${this.definition.name}`);
    
    return this.createSuccessResult(result);
  } catch (error) {
    // Log detailed error information
    console.error(`Tool execution failed: ${this.definition.name}`, {
      error: error.message,
      stack: error.stack,
      args
    });
    
    return this.createErrorResult(error);
  }
}
```

#### Permission and Security Issues
```bash
# Problem: Permission denied errors
# Solution: Check file permissions and user context

# Check file permissions
ls -la dist/index.js

# Ensure executable permissions
chmod +x dist/index.js

# Check user context
whoami
groups

# Verify environment variables
printenv | grep -E "(API_KEY|TOKEN|SECRET)"
```

### 9.2 Debugging Workflow

#### Step-by-Step Debugging Process
```bash
# 1. Verify server builds correctly
npm run build
echo "Exit code: $?"

# 2. Test server in isolation
node dist/index.js < test-input.json

# 3. Check Claude Code integration
claude mcp list
claude mcp add test-server -s local --debug -- node dist/index.js

# 4. Monitor server logs
tail -f ~/.claude/logs/mcp-server.log

# 5. Test individual tools
echo '{"method": "tools/call", "params": {"name": "analyze_pdf", "arguments": {"file_path": "test.pdf"}}, "id": 1}' | node dist/index.js
```

#### Debug Output Analysis
```typescript
// Add structured debug output
export class DebugHelper {
  static logRequest(method: string, params: unknown) {
    if (process.env.DEBUG === 'true') {
      console.error(`[DEBUG] Request: ${method}`, JSON.stringify(params, null, 2));
    }
  }

  static logResponse(method: string, response: unknown) {
    if (process.env.DEBUG === 'true') {
      console.error(`[DEBUG] Response: ${method}`, JSON.stringify(response, null, 2));
    }
  }

  static logError(context: string, error: Error) {
    console.error(`[ERROR] ${context}:`, {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
}
```

### 9.3 Performance Issues

#### Performance Monitoring
```typescript
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  startTiming(operation: string): () => void {
    const start = Date.now();
    
    return () => {
      const duration = Date.now() - start;
      this.recordMetric(operation, duration);
    };
  }

  recordMetric(operation: string, duration: number) {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    
    const operationMetrics = this.metrics.get(operation)!;
    operationMetrics.push(duration);
    
    // Keep only last 100 measurements
    if (operationMetrics.length > 100) {
      operationMetrics.shift();
    }
  }

  getStats(operation: string) {
    const measurements = this.metrics.get(operation) || [];
    if (measurements.length === 0) return null;

    const sorted = [...measurements].sort((a, b) => a - b);
    return {
      count: measurements.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: measurements.reduce((a, b) => a + b, 0) / measurements.length,
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)]
    };
  }
}
```

#### Memory Management
```typescript
export class ResourceManager {
  private resources: Map<string, WeakRef<unknown>> = new Map();

  storeResource(key: string, resource: unknown) {
    this.resources.set(key, new WeakRef(resource));
  }

  getResource<T>(key: string): T | null {
    const ref = this.resources.get(key);
    if (!ref) return null;

    const resource = ref.deref();
    if (!resource) {
      // Resource was garbage collected
      this.resources.delete(key);
      return null;
    }

    return resource as T;
  }

  cleanup() {
    // Remove dead references
    for (const [key, ref] of this.resources.entries()) {
      if (!ref.deref()) {
        this.resources.delete(key);
      }
    }
  }

  // Periodic cleanup
  startPeriodicCleanup(intervalMs: number = 60000) {
    setInterval(() => this.cleanup(), intervalMs);
  }
}
```

---

## 10. Production Considerations

### 10.1 Monitoring and Observability

#### Structured Logging for Production
```typescript
import { createLogger, format, transports } from 'winston';

export class ProductionLogger {
  private logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.json()
    ),
    defaultMeta: {
      service: 'mcp-server',
      version: process.env.VERSION || '1.0.0'
    },
    transports: [
      new transports.File({ filename: 'logs/error.log', level: 'error' }),
      new transports.File({ filename: 'logs/combined.log' })
    ]
  });

  // Add console logging for development
  constructor() {
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new transports.Console({
        format: format.simple()
      }));
    }
  }

  info(message: string, meta?: object) {
    this.logger.info(message, meta);
  }

  error(message: string, error?: Error, meta?: object) {
    this.logger.error(message, { ...meta, error: error?.message, stack: error?.stack });
  }

  warn(message: string, meta?: object) {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta?: object) {
    this.logger.debug(message, meta);
  }
}
```

#### Health Check Implementation
```typescript
export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  checks: Record<string, CheckResult>;
}

export interface CheckResult {
  status: 'pass' | 'fail' | 'warn';
  message?: string;
  duration?: number;
}

export class HealthChecker {
  private checks: Map<string, () => Promise<CheckResult>> = new Map();

  registerCheck(name: string, check: () => Promise<CheckResult>) {
    this.checks.set(name, check);
  }

  async performHealthCheck(): Promise<HealthStatus> {
    const results: Record<string, CheckResult> = {};
    let overallStatus: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';

    for (const [name, check] of this.checks) {
      try {
        const start = Date.now();
        const result = await Promise.race([
          check(),
          new Promise<CheckResult>((_, reject) => 
            setTimeout(() => reject(new Error('Check timeout')), 5000)
          )
        ]);
        
        result.duration = Date.now() - start;
        results[name] = result;

        if (result.status === 'fail') {
          overallStatus = 'unhealthy';
        } else if (result.status === 'warn' && overallStatus === 'healthy') {
          overallStatus = 'degraded';
        }
      } catch (error) {
        results[name] = {
          status: 'fail',
          message: error.message
        };
        overallStatus = 'unhealthy';
      }
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: results
    };
  }
}
```

### 10.2 Error Handling and Recovery

#### Circuit Breaker Pattern
```typescript
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime: number | null = null;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000,
    private resetTimeout: number = 30000
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime! < this.resetTimeout) {
        throw new Error('Circuit breaker is open');
      }
      this.state = 'half-open';
    }

    try {
      const result = await Promise.race([
        operation(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Operation timeout')), this.timeout)
        )
      ]);

      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }
}
```

#### Graceful Shutdown
```typescript
export class GracefulShutdown {
  private shutdownHandlers: Array<() => Promise<void>> = [];
  private isShuttingDown = false;

  constructor() {
    this.setupSignalHandlers();
  }

  addShutdownHandler(handler: () => Promise<void>) {
    this.shutdownHandlers.push(handler);
  }

  private setupSignalHandlers() {
    process.on('SIGTERM', () => this.shutdown('SIGTERM'));
    process.on('SIGINT', () => this.shutdown('SIGINT'));
    process.on('uncaughtException', (error) => {
      console.error('Uncaught exception:', error);
      this.shutdown('uncaughtException');
    });
  }

  private async shutdown(signal: string) {
    if (this.isShuttingDown) return;
    
    console.log(`Received ${signal}. Starting graceful shutdown...`);
    this.isShuttingDown = true;

    const timeout = setTimeout(() => {
      console.error('Shutdown timeout exceeded. Forcing exit.');
      process.exit(1);
    }, 30000);

    try {
      await Promise.all(
        this.shutdownHandlers.map(handler => 
          handler().catch(error => 
            console.error('Shutdown handler failed:', error)
          )
        )
      );

      clearTimeout(timeout);
      console.log('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      console.error('Shutdown failed:', error);
      process.exit(1);
    }
  }
}
```

### 10.3 Security Hardening

#### Rate Limiting
```typescript
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 60000
  ) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get existing requests for this identifier
    const requests = this.requests.get(identifier) || [];
    
    // Remove requests outside the window
    const validRequests = requests.filter(timestamp => timestamp > windowStart);
    
    // Check if limit exceeded
    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);

    return true;
  }

  cleanup() {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    for (const [identifier, requests] of this.requests.entries()) {
      const validRequests = requests.filter(timestamp => timestamp > windowStart);
      
      if (validRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validRequests);
      }
    }
  }
}
```

#### Input Sanitization
```typescript
export class InputSanitizer {
  private static readonly DANGEROUS_PATTERNS = [
    /[;&|`$(){}[\]\\]/g,          // Command injection
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // XSS
    /javascript:/gi,              // JavaScript URLs
    /on\w+\s*=/gi,               // Event handlers
    /\.\.\/|\.\.\\\/g,           // Path traversal
  ];

  static sanitizeString(input: string): string {
    let sanitized = input;
    
    // Remove dangerous patterns
    this.DANGEROUS_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });

    // Escape HTML
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');

    return sanitized;
  }

  static sanitizeFilePath(path: string): string {
    // Remove path traversal attempts
    return path.replace(/\.\.\/|\.\.\\\/g, '').replace(/^\/+/, '');
  }

  static validateApiKey(apiKey: string): boolean {
    // Validate API key format
    return /^[a-zA-Z0-9_-]{20,}$/.test(apiKey);
  }
}
```

### 10.4 Performance Optimization

#### Connection Pooling
```typescript
export class ConnectionPool<T> {
  private pool: T[] = [];
  private active: Set<T> = new Set();
  private waiting: Array<(connection: T) => void> = [];

  constructor(
    private createConnection: () => Promise<T>,
    private destroyConnection: (connection: T) => Promise<void>,
    private maxSize: number = 10,
    private minSize: number = 2
  ) {
    this.initialize();
  }

  private async initialize() {
    // Create minimum connections
    for (let i = 0; i < this.minSize; i++) {
      try {
        const connection = await this.createConnection();
        this.pool.push(connection);
      } catch (error) {
        console.error('Failed to create initial connection:', error);
      }
    }
  }

  async acquire(): Promise<T> {
    // Return available connection from pool
    if (this.pool.length > 0) {
      const connection = this.pool.pop()!;
      this.active.add(connection);
      return connection;
    }

    // Create new connection if under limit
    if (this.active.size < this.maxSize) {
      try {
        const connection = await this.createConnection();
        this.active.add(connection);
        return connection;
      } catch (error) {
        throw new Error(`Failed to create connection: ${error.message}`);
      }
    }

    // Wait for connection to become available
    return new Promise((resolve) => {
      this.waiting.push(resolve);
    });
  }

  async release(connection: T) {
    this.active.delete(connection);

    // Give to waiting request if any
    if (this.waiting.length > 0) {
      const resolve = this.waiting.shift()!;
      this.active.add(connection);
      resolve(connection);
    } else {
      // Return to pool
      this.pool.push(connection);
    }
  }

  async destroy() {
    // Destroy all connections
    const allConnections = [...this.pool, ...this.active];
    await Promise.all(
      allConnections.map(conn => this.destroyConnection(conn))
    );
    
    this.pool = [];
    this.active.clear();
    this.waiting = [];
  }
}
```

---

## Conclusion

This comprehensive guide provides the foundation for building robust, secure, and scalable MCP servers for Claude Code integration. The patterns and practices outlined here are based on real-world implementations and industry best practices.

**Key Takeaways:**
1. **Start Simple:** Begin with basic tool implementation and gradually add complexity
2. **Security First:** Always validate inputs and implement proper error handling
3. **Test Thoroughly:** Use the provided testing patterns to ensure reliability
4. **Monitor in Production:** Implement proper logging and health checks
5. **Follow Patterns:** Use the established patterns for consistency and maintainability

**Next Steps:**
1. Choose your development approach (local, team, or cloud deployment)
2. Implement your first MCP server using the provided templates
3. Test integration with Claude Code
4. Deploy and monitor in your target environment

For additional support and community resources, visit the official MCP documentation and community forums.

---

**Document Version:** 1.0  
**Last Updated:** July 2, 2025  
**Next Review:** August 2025