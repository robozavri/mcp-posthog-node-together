"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupTypeHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.GroupTypeGetSchema;
const getGroupTypeHandler = async (context, params) => {
    const { groupTypeIndex } = params;
    const projectId = await context.getProjectId();
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/api/projects/${projectId}/groups_types/${groupTypeIndex}/`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get group type: ${response.status} ${errorText}`);
    }
    const groupType = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(groupType, null, 2),
            },
        ],
    };
};
exports.getGroupTypeHandler = getGroupTypeHandler;
const tool = () => ({
    name: "get-group-type",
    description: `
        - Get a specific group type by index.
        - Returns detailed information about the group type.
    `,
    schema,
    handler: exports.getGroupTypeHandler,
});
exports.default = tool;
