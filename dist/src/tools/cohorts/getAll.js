"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.CohortGetAllSchema;
const getAllHandler = async (context, params) => {
    const projectId = await context.getProjectId();
    const { data } = params;
    const queryParams = new URLSearchParams();
    if (data?.limit)
        queryParams.append("limit", data.limit.toString());
    if (data?.offset)
        queryParams.append("offset", data.offset.toString());
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/cohorts/?${queryParams.toString()}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get cohorts: ${response.status} ${errorText}`);
    }
    const cohorts = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(cohorts, null, 2),
            },
        ],
    };
};
exports.getAllHandler = getAllHandler;
const tool = () => ({
    name: "get-all-cohorts",
    description: `
        - List all cohorts in the project.
        - Supports pagination with limit/offset.
        - Returns paginated results with next/previous links.
    `,
    schema,
    handler: exports.getAllHandler,
});
exports.default = tool;
