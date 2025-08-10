"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryResultHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.QueryGetResultSchema;
const getQueryResultHandler = async (context, params) => {
    const { projectId, queryId } = params;
    const url = `${(0, api_1.getProjectBaseUrl)(String(projectId))}/query/${String(queryId)}/`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get query result: ${response.status} ${errorText}`);
    }
    const result = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(result, null, 2),
            },
        ],
    };
};
exports.getQueryResultHandler = getQueryResultHandler;
const tool = () => ({
    name: "get-query-result",
    description: `
        - Get a specific query result by ID.
        - Returns detailed information about the query execution and results.
    `,
    schema,
    handler: exports.getQueryResultHandler,
});
exports.default = tool;
