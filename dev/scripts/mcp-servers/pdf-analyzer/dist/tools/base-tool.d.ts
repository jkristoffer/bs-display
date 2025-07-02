import { z } from "zod";
import { ToolDefinition, ToolResult } from "../types/index.js";
export declare abstract class BaseTool {
    abstract get definition(): ToolDefinition;
    abstract execute(args: unknown): Promise<ToolResult>;
    protected validateInput<T>(schema: z.ZodSchema<T>, input: unknown): T;
    protected createSuccessResult(text: string): ToolResult;
    protected createErrorResult(error: string | Error): ToolResult;
    protected log(message: string, data?: unknown): void;
}
