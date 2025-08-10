"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunnelUsersHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.FunnelGetUsersSchema;
const getFunnelUsersHandler = async (context, params) => {
    const { projectId, insightId, step, status, limit, offset } = params;
    // Build query parameters for the funnel users endpoint
    const queryParams = new URLSearchParams();
    queryParams.append("step", step.toString());
    queryParams.append("status", status);
    if (limit)
        queryParams.append("limit", limit.toString());
    if (offset)
        queryParams.append("offset", offset.toString());
    const url = `${(0, api_1.getProjectBaseUrl)(String(projectId))}/insights/${insightId}/persons/?${queryParams.toString()}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get funnel users: ${response.status} ${errorText}`);
    }
    const result = await response.json();
    return {
        content: [
            {
                type: "text",
                text: `Found ${result.results?.length || 0} users who ${status} at step ${step}:\n${JSON.stringify(result, null, 2)}`,
            },
        ],
    };
};
exports.getFunnelUsersHandler = getFunnelUsersHandler;
const tool = () => ({
    name: "get-funnel-users",
    description: `
        - Get users who completed or dropped at a specific funnel step.
        - Useful for understanding who is struggling or succeeding in your funnel.
        - Can be used to create cohorts for further analysis.
        - Returns paginated list of users with their properties and behavior.
    `,
    schema,
    handler: exports.getFunnelUsersHandler,
});
exports.default = tool;
