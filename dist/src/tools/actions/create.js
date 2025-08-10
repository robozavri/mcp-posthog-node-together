"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.ActionCreateSchema;
const createHandler = async (context, params) => {
    const { data } = params;
    const projectId = await context.getProjectId();
    const payload = {
        name: data.name,
        description: data.description,
        post_to_slack: data.post_to_slack,
        slack_message_format: data.slack_message_format,
        steps: data.steps,
        deleted: data.deleted,
        is_calculating: data.is_calculating,
        created_by: data.created_by,
        created_at: data.created_at,
        updated_at: data.updated_at,
    };
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/actions/`;
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
        throw new Error(`Failed to create action: ${response.status} ${errorText}`);
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
exports.createHandler = createHandler;
const tool = () => ({
    name: "create-action",
    description: `
        - Create a new action with steps and triggers.
        - Supports Slack integration and custom message formats.
        - Returns the created action details.
    `,
    schema,
    handler: exports.createHandler,
});
exports.default = tool;
