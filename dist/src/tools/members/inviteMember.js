"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviteMemberHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.MemberInviteSchema;
const inviteMemberHandler = async (context, params) => {
    const { data } = params;
    const projectId = await context.getProjectId();
    const payload = {
        email: data.email,
        level: data.level,
        first_name: data.first_name,
        last_name: data.last_name,
    };
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/organizations/${data.organizationId}/members/`;
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
        throw new Error(`Failed to invite member: ${response.status} ${errorText}`);
    }
    const member = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(member, null, 2),
            },
        ],
    };
};
exports.inviteMemberHandler = inviteMemberHandler;
const tool = () => ({
    name: "invite-member",
    description: `
        - Invite a new member to the organization.
        - Supports setting access level and member details.
        - Returns the invited member details.
    `,
    schema,
    handler: exports.inviteMemberHandler,
});
exports.default = tool;
