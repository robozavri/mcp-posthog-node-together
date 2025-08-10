"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGroupHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.GroupUpdateSchema;
const updateGroupHandler = async (context, params) => {
    const { groupTypeIndex, groupKey, data } = params;
    const projectId = await context.getProjectId();
    const payload = {
        group_type_index: groupTypeIndex,
        group_key: groupKey,
    };
    if (data.group_properties !== undefined)
        payload.group_properties = data.group_properties;
    const queryParams = new URLSearchParams();
    queryParams.append("group_key", groupKey);
    queryParams.append("group_type_index", groupTypeIndex.toString());
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/api/projects/${projectId}/groups/update_property/?${queryParams.toString()}`;
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
        throw new Error(`Failed to update group: ${response.status} ${errorText}`);
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
exports.updateGroupHandler = updateGroupHandler;
const tool = () => ({
    name: "update-group",
    description: `
        - Update a group's properties by type index and key.
        - Supports updating group properties.
        - Returns the updated group details.
    `,
    schema,
    handler: exports.updateGroupHandler,
});
exports.default = tool;
