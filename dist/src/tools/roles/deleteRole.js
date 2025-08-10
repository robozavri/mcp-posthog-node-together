"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoleHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.RoleDeleteSchema;
const deleteRoleHandler = async (context, params) => {
    const { organizationId, roleId } = params;
    const projectId = await context.getProjectId();
    const baseUrl = (0, api_1.getProjectBaseUrl)(projectId);
    const url = `${baseUrl}/organizations/${organizationId}/roles/${roleId}/`;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete role: ${response.status} ${errorText}`);
    }
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify({ success: true, message: "Role deleted successfully" }, null, 2),
            },
        ],
    };
};
exports.deleteRoleHandler = deleteRoleHandler;
const tool = () => ({
    name: "delete-role",
    description: `
        - Delete a role by organization ID and role ID.
        - This action cannot be undone.
        - Returns success confirmation.
    `,
    schema,
    handler: exports.deleteRoleHandler,
});
exports.default = tool;
