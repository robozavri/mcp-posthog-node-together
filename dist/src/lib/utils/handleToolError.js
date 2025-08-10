"use strict";
/**
 * Handles tool errors and returns a structured error message.
 * @param error - The error object.
 * @param context - Optional context to add to the error message.
 * @returns A structured error message.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleToolError = handleToolError;
function handleToolError(error, context) {
    if (context) {
        console.error(`[MCP Error][${context}]`, error);
    }
    else {
        console.error('[MCP Error]', error);
    }
    return {
        content: [
            {
                type: "text",
                text: `Error: ${error?.message || "An error occurred."}${context ? ` (Context: ${context})` : ""}`,
            },
        ],
    };
}
