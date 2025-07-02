import { z } from "zod";
export class BaseTool {
    validateInput(schema, input) {
        try {
            return schema.parse(input);
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
                throw new Error(`Invalid input: ${messages.join(', ')}`);
            }
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Validation error: ${errorMessage}`);
        }
    }
    createSuccessResult(text) {
        return { content: [{ type: "text", text }] };
    }
    createErrorResult(error) {
        const message = error instanceof Error ? error.message : error;
        return {
            content: [{ type: "text", text: `Error: ${message}` }],
            isError: true
        };
    }
    log(message, data) {
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
//# sourceMappingURL=base-tool.js.map