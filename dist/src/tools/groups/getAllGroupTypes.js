"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllGroupTypesHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.GroupTypeGetAllSchema;
const getAllGroupTypesHandler = async (context, params) => {
    const projectId = await context.getProjectId();
    const { data } = params;
    const queryParams = new URLSearchParams();
    if (data?.limit)
        queryParams.append("limit", data.limit.toString());
    if (data?.offset)
        queryParams.append("offset", data.offset.toString());
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/api/projects/${projectId}/groups_types/?${queryParams.toString()}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get group types: ${response.status} ${errorText}`);
    }
    const groupTypes = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(groupTypes, null, 2),
            },
        ],
    };
};
exports.getAllGroupTypesHandler = getAllGroupTypesHandler;
const tool = () => ({
    name: "get-all-group-types",
    description: `
        - List all group types in the project.
        - Supports pagination with limit/offset.
        - Returns paginated results with next/previous links.
    `,
    schema,
    handler: exports.getAllGroupTypesHandler,
});
exports.default = tool;
