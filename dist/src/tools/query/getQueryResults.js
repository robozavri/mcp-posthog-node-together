"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryResultsHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.QueryGetResultsSchema;
const getQueryResultsHandler = async (context, params) => {
    const { data } = params;
    const { projectId, ...filters } = data;
    const queryParams = new URLSearchParams();
    if (filters.limit)
        queryParams.append("limit", filters.limit.toString());
    if (filters.offset)
        queryParams.append("offset", filters.offset.toString());
    if (filters.query_type)
        queryParams.append("query_type", filters.query_type);
    if (filters.status)
        queryParams.append("status", filters.status);
    const url = `${(0, api_1.getProjectBaseUrl)(String(projectId))}/query/?${queryParams.toString()}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get query results: ${response.status} ${errorText}`);
    }
    const results = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(results, null, 2),
            },
        ],
    };
};
exports.getQueryResultsHandler = getQueryResultsHandler;
const tool = () => ({
    name: "get-query-results",
    description: `
        - List query results for the project.
        - Supports pagination and filtering by query type and status.
        - Returns paginated results with next/previous links.
    `,
    schema,
    handler: exports.getQueryResultsHandler,
});
exports.default = tool;
