"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchDocsHandler = void 0;
const inkeepApi_1 = require("@/inkeepApi");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.DocumentationSearchSchema;
const searchDocsHandler = async (context, params) => {
    const { query } = params;
    const inkeepApiKey = context.apiToken;
    if (!inkeepApiKey) {
        return {
            content: [
                {
                    type: "text",
                    text: "Error: INKEEP_API_KEY is not configured.",
                },
            ],
        };
    }
    const resultText = await (0, inkeepApi_1.docsSearch)(inkeepApiKey, query);
    return { content: [{ type: "text", text: resultText }] };
};
exports.searchDocsHandler = searchDocsHandler;
const tool = () => ({
    name: "docs-search",
    description: `
        - Use this tool to search the PostHog documentation for information that can help the user with their request. 
        - Use it as a fallback when you cannot answer the user's request using other tools in this MCP.
    `,
    schema,
    handler: exports.searchDocsHandler,
});
exports.default = tool;
