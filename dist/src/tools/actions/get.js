"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.ActionGetSchema;
const getHandler = async (context, params) => {
    const { actionId } = params;
    const projectId = await context.getProjectId();
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/actions/${actionId}/`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get action: ${response.status} ${errorText}`);
    }
    const action = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(action, null, 2),
            },
        ],
    };
};
exports.getHandler = getHandler;
const tool = () => ({
    name: "get-action",
    description: `
        - Get a specific action by ID.
        - Returns detailed information about the action including steps and triggers.
    `,
    schema,
    handler: exports.getHandler,
});
exports.default = tool;
