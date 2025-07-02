export interface ToolResult {
    content: Array<{
        type: "text";
        text: string;
    }>;
    isError?: boolean;
    [key: string]: unknown;
}
export interface AnalysisOptions {
    file_path: string;
    analysis_type?: 'extract' | 'summarize' | 'pricing' | 'specifications';
    custom_prompt?: string;
}
export interface ToolDefinition {
    name: string;
    description?: string;
    inputSchema: {
        type: "object";
        properties?: Record<string, unknown>;
        required?: string[];
        [key: string]: unknown;
    };
    [key: string]: unknown;
}
export interface ServerConfig {
    name: string;
    version: string;
    debug?: boolean;
}
