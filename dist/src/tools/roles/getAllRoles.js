"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRolesHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.RoleGetAllSchema;
const getAllRolesHandler = async (context, params) => {
    const { data } = params;
    const { organizationId } = data;
    const queryParams = new URLSearchParams();
    if (data?.limit)
        queryParams.append("limit", data.limit.toString());
    if (data?.offset)
        queryParams.append("offset", data.offset.toString());
    const projectId = await context.getProjectId();
    const baseUrl = (0, api_1.getProjectBaseUrl)(projectId);
    const url = `${baseUrl}/organizations/${organizationId}/roles/?${queryParams.toString()}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get roles: ${response.status} ${errorText}`);
    }
    const roles = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(roles, null, 2),
            },
        ],
    };
};
exports.getAllRolesHandler = getAllRolesHandler;
const tool = () => ({
    name: "get-all-roles",
    description: `
        - List all roles in the organization.
        - Supports pagination with limit/offset.
        - Returns paginated results with next/previous links.
    `,
    schema,
    handler: exports.getAllRolesHandler,
});
exports.default = tool;
