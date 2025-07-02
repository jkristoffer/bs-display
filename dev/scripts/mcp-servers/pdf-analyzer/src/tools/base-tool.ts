import { z } from "zod";
import { ToolDefinition, ToolResult } from "../types/index.js";

export abstract class BaseTool {
  abstract get definition(): ToolDefinition;
  abstract execute(args: unknown): Promise<ToolResult>;

  protected validateInput<T>(schema: z.ZodSchema<T>, input: unknown): T {
    try {
      return schema.parse(input);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        throw new Error(`Invalid input: ${messages.join(', ')}`);
      }
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Validation error: ${errorMessage}`);
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

  protected log(message: string, data?: unknown): void {
    if (process.env.DEBUG === 'true') {
      const logEntry = {
        timestamp: new Date().toISOString(),
        tool: this.definition.name,
        message,
        data
      };
      // Write to stderr to avoid interfering with MCP communication
      console.error(JSON.stringify(logEntry));
    }
  }
}