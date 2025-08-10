"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.GroupGetSchema;
const getGroupHandler = async (context, params) => {
    const { groupTypeIndex, groupKey } = params;
    const projectId = await context.getProjectId();
    const queryParams = new URLSearchParams();
    queryParams.append("group_key", groupKey);
    queryParams.append("group_type_index", groupTypeIndex.toString());
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/api/projects/${projectId}/groups/find/?${queryParams.toString()}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get group: ${response.status} ${errorText}`);
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
exports.getGroupHandler = getGroupHandler;
const tool = () => ({
    name: "get-group",
    description: `
        - Get a specific group by type index and key.
        - Returns detailed information about the group including properties.
    `,
    schema,
    handler: exports.getGroupHandler,
});
exports.default = tool;
