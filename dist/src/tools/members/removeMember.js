"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMemberHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.MemberRemoveSchema;
const removeMemberHandler = async (context, params) => {
    const { organizationId, userUuid } = params;
    const projectId = await context.getProjectId();
    const baseUrl = await (0, api_1.getProjectBaseUrl)(projectId);
    const resolvedBaseUrl = await baseUrl;
    const url = `${resolvedBaseUrl}/organizations/${organizationId}/members/${userUuid}/`;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to remove member: ${response.status} ${errorText}`);
    }
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify({ success: true, message: "Member removed successfully" }, null, 2),
            },
        ],
    };
};
exports.removeMemberHandler = removeMemberHandler;
const tool = () => ({
    name: "remove-member",
    description: `
        - Remove a member from the organization by organization ID and user UUID.
        - This action cannot be undone.
        - Returns success confirmation.
    `,
    schema,
    handler: exports.removeMemberHandler,
});
exports.default = tool;
