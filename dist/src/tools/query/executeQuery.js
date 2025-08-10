"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeQueryHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.QueryExecuteSchema;
const executeQueryHandler = async (context, params) => {
    const { data } = params;
    const payload = {
        query: data.query,
        query_type: data.query_type,
        refresh: data.refresh,
        client_query_id: data.client_query_id,
    };
    const url = `${(0, api_1.getProjectBaseUrl)(String(data.projectId))}/query/`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to execute query: ${response.status} ${errorText}`);
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
exports.executeQueryHandler = executeQueryHandler;
const tool = () => ({
    name: "execute-query",
    description: `
        - Execute a SQL or HogQL query against the project data.
        - Supports both SQL and HogQL query types.
        - Returns query execution results with status and data.
    `,
    schema,
    handler: exports.executeQueryHandler,
});
exports.default = tool;
