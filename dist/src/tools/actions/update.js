"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.ActionUpdateSchema;
const updateHandler = async (context, params) => {
    const { actionId, data } = params;
    const projectId = await context.getProjectId();
    const payload = {};
    if (data.name !== undefined)
        payload.name = data.name;
    if (data.description !== undefined)
        payload.description = data.description;
    if (data.post_to_slack !== undefined)
        payload.post_to_slack = data.post_to_slack;
    if (data.slack_message_format !== undefined)
        payload.slack_message_format = data.slack_message_format;
    if (data.steps !== undefined)
        payload.steps = data.steps;
    if (data.deleted !== undefined)
        payload.deleted = data.deleted;
    if (data.is_calculating !== undefined)
        payload.is_calculating = data.is_calculating;
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/actions/${actionId}/`;
    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update action: ${response.status} ${errorText}`);
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
exports.updateHandler = updateHandler;
const tool = () => ({
    name: "update-action",
    description: `
        - Update an action's properties by ID.
        - Supports updating name, description, steps, and Slack settings.
        - Returns the updated action details.
    `,
    schema,
    handler: exports.updateHandler,
});
exports.default = tool;
