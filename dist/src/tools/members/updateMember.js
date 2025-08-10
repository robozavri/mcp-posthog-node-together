"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMemberHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.MemberUpdateSchema;
const updateMemberHandler = async (context, params) => {
    const { organizationId, userUuid, data } = params;
    const payload = {};
    if (data.level !== undefined)
        payload.level = data.level;
    if (data.first_name !== undefined)
        payload.first_name = data.first_name;
    if (data.last_name !== undefined)
        payload.last_name = data.last_name;
    const url = `${(0, api_1.getProjectBaseUrl)(context)}/organizations/${organizationId}/members/${userUuid}/`;
    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update member: ${response.status} ${errorText}`);
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
exports.updateMemberHandler = updateMemberHandler;
const tool = () => ({
    name: "update-member",
    description: `
        - Update a member's properties by organization ID and user UUID.
        - Supports updating access level and member details.
        - Returns the updated member details.
    `,
    schema,
    handler: exports.updateMemberHandler,
});
exports.default = tool;
