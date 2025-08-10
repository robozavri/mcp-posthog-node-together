"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoleHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.RoleGetSchema;
const getRoleHandler = async (context, params) => {
    const { organizationId, roleId } = params;
    const projectId = await context.getProjectId();
    const baseUrl = (0, api_1.getProjectBaseUrl)(projectId);
    const url = `${baseUrl}/organizations/${organizationId}/roles/${roleId}/`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get role: ${response.status} ${errorText}`);
    }
    const role = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(role, null, 2),
            },
        ],
    };
};
exports.getRoleHandler = getRoleHandler;
const tool = () => ({
    name: "get-role",
    description: `
        - Get a specific role by organization ID and role ID.
        - Returns detailed information about the role including permissions.
    `,
    schema,
    handler: exports.getRoleHandler,
});
exports.default = tool;
