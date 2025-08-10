"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllEnvironmentsHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.EnvironmentGetAllSchema;
const getAllEnvironmentsHandler = async (context, params) => {
    const { data } = params;
    const { projectId, ...filters } = data;
    const queryParams = new URLSearchParams();
    if (filters.limit)
        queryParams.append("limit", filters.limit.toString());
    if (filters.offset)
        queryParams.append("offset", filters.offset.toString());
    const url = `${(0, api_1.getProjectBaseUrl)(String(projectId))}/environments/?${queryParams.toString()}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get environments: ${response.status} ${errorText}`);
    }
    const environments = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(environments, null, 2),
            },
        ],
    };
};
exports.getAllEnvironmentsHandler = getAllEnvironmentsHandler;
const tool = () => ({
    name: "get-all-environments",
    description: `
        - List all environments in the project.
        - Supports pagination with limit/offset.
        - Returns paginated results with next/previous links.
    `,
    schema,
    handler: exports.getAllEnvironmentsHandler,
});
exports.default = tool;
