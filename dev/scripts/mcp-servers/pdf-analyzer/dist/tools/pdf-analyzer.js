import { BaseTool } from "./base-tool.js";
import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
const execAsync = promisify(exec);
const PdfAnalyzerInputSchema = z.object({
    file_path: z.string()
        .min(1, "File path is required")
        .refine((filePath) => {
        // Basic path validation - ensure it doesn't contain dangerous patterns
        return !filePath.includes('..') && !filePath.includes('|') && !filePath.includes(';');
    }, { message: "Invalid file path format" }),
    analysis_type: z.enum(["extract", "summarize", "pricing", "specifications"]).default("extract"),
    custom_prompt: z.string().optional()
});
export class PdfAnalyzerTool extends BaseTool {
    get definition() {
        return {
            name: "analyze_pdf",
            description: "Analyze PDF files using Gemini CLI with various analysis types",
            inputSchema: {
                type: "object",
                properties: {
                    file_path: {
                        type: "string",
                        description: "Path to the PDF file to analyze (relative to current directory)"
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
    async execute(args) {
        try {
            this.log("Starting PDF analysis", args);
            const validatedInput = this.validateInput(PdfAnalyzerInputSchema, args);
            const { file_path, analysis_type, custom_prompt } = validatedInput;
            // Validate file exists and is safe to access
            await this.validateFilePath(file_path);
            // Build analysis prompt
            const prompt = this.buildAnalysisPrompt(file_path, analysis_type || 'extract', custom_prompt || undefined);
            this.log("Executing Gemini CLI", { file_path, analysis_type, prompt_length: prompt.length });
            // Execute Gemini CLI with timeout
            const { stdout, stderr } = await this.executeGeminiCLI(prompt);
            if (stderr && stderr.trim()) {
                this.log("Gemini CLI stderr output", { stderr });
            }
            const result = stdout.trim();
            if (!result) {
                throw new Error("Gemini CLI returned empty result");
            }
            this.log("PDF analysis completed successfully", { result_length: result.length });
            return this.createSuccessResult(result);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.log("PDF analysis failed", { error: errorMessage });
            return this.createErrorResult(error instanceof Error ? error : new Error(String(error)));
        }
    }
    async validateFilePath(filePath) {
        try {
            // Resolve the path and ensure it's within current working directory
            const resolvedPath = path.resolve(filePath);
            const cwd = process.cwd();
            if (!resolvedPath.startsWith(cwd)) {
                throw new Error("File path must be within current directory");
            }
            // Check if file appears to be a PDF
            if (!filePath.toLowerCase().endsWith('.pdf')) {
                this.log("Warning: File does not have .pdf extension", { filePath });
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Invalid file path: ${errorMessage}`);
        }
    }
    async executeGeminiCLI(prompt) {
        // Escape the prompt to prevent command injection
        const escapedPrompt = prompt.replace(/"/g, '\\"');
        const command = `gemini -p "${escapedPrompt}"`;
        try {
            const result = await Promise.race([
                execAsync(command, {
                    maxBuffer: 1024 * 1024 * 10, // 10MB buffer
                    timeout: 120000 // 2 minute timeout
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini CLI timeout after 2 minutes')), 120000))
            ]);
            return result;
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                throw new Error('Gemini CLI not found. Please ensure it is installed and in PATH.');
            }
            if (error.signal === 'SIGTERM') {
                throw new Error('Gemini CLI execution was terminated due to timeout');
            }
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Gemini CLI execution failed: ${errorMessage}`);
        }
    }
    buildAnalysisPrompt(filePath, analysisType, customPrompt) {
        let basePrompt = `I have a PDF file called '${path.basename(filePath)}' in my current directory. `;
        if (customPrompt) {
            return basePrompt + customPrompt;
        }
        const analysisPrompts = {
            extract: "Extract all key information, text content, and important details from this PDF document. Provide a comprehensive extraction of the content.",
            summarize: "Provide a comprehensive summary of the main points, conclusions, and key takeaways from this PDF. Include the document's purpose and main findings.",
            pricing: "Focus specifically on extracting pricing information, costs, financial details, quotations, and any monetary values mentioned in this PDF. Organize the pricing data clearly.",
            specifications: "Extract technical specifications, product details, features, dimensions, requirements, and any technical documentation from this PDF. Focus on measurable and technical data."
        };
        return basePrompt + (analysisPrompts[analysisType] || analysisPrompts['extract']);
    }
}
//# sourceMappingURL=pdf-analyzer.js.map