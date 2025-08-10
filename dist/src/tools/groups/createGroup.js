"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGroupHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.GroupCreateSchema;
const createGroupHandler = async (context, params) => {
    const { data } = params;
    const projectId = await context.getProjectId();
    const payload = {
        group_type_index: data.groupTypeIndex,
        group_key: data.group_key,
        group_properties: data.group_properties,
        created_at: data.created_at,
        updated_at: data.updated_at,
    };
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/api/projects/${projectId}/groups/`;
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
        throw new Error(`Failed to create group: ${response.status} ${errorText}`);
    }
    const group = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(group, null, 2),
            },
        ],
    };
};
exports.createGroupHandler = createGroupHandler;
const tool = () => ({
    name: "create-group",
    description: `
        - Create a new group for a specific group type.
        - Supports custom group properties and timestamps.
        - Returns the created group details.
    `,
    schema,
    handler: exports.createGroupHandler,
});
exports.default = tool;
