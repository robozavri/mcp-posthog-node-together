"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFunnelHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.FunnelDeleteSchema;
const deleteFunnelHandler = async (context, params) => {
    const { projectId, insightId } = params;
    const url = `${(0, api_1.getProjectBaseUrl)(String(projectId))}/insights/${insightId}/`;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete funnel: ${response.status} ${errorText}`);
    }
    return {
        content: [
            {
                type: "text",
                text: `Successfully deleted funnel insight with ID: ${insightId}`,
            },
        ],
    };
};
exports.deleteFunnelHandler = deleteFunnelHandler;
const tool = () => ({
    name: "delete-funnel",
    description: `
        - Delete a funnel insight from PostHog.
        - Permanently removes the funnel and its configuration.
        - Cannot be undone - use with caution.
        - Returns confirmation of deletion.
    `,
    schema,
    handler: exports.deleteFunnelHandler,
});
exports.default = tool;
