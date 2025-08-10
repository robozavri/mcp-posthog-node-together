"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.InsightGetSchema;
const getHandler = async (context, params) => {
    const { insightId } = params;
    const projectId = await context.getProjectId();
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/insights/${insightId}/`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get insight: ${response.status} ${errorText}`);
    }
    const insight = await response.json();
    const insightWithUrl = {
        ...insight,
        url: `${(0, api_1.getProjectBaseUrl)(projectId)}/insights/${insight.short_id}`,
    };
    return {
        content: [{
                type: "text",
                text: JSON.stringify(insightWithUrl, null, 2)
            }]
    };
};
exports.getHandler = getHandler;
const tool = () => ({
    name: "insight-get",
    description: `
        - Get a specific insight by ID.
        - Returns insight details with URL for easy access.
    `,
    schema,
    handler: exports.getHandler,
});
exports.default = tool;
