import { BaseTool } from "./base-tool.js";
import { ToolDefinition, ToolResult } from "../types/index.js";
export declare class PdfAnalyzerTool extends BaseTool {
    get definition(): ToolDefinition;
    execute(args: unknown): Promise<ToolResult>;
    private validateFilePath;
    private executeGeminiCLI;
    private buildAnalysisPrompt;
}
