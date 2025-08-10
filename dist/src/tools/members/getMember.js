"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMemberHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.MemberGetSchema;
const getMemberHandler = async (context, params) => {
    const { organizationId, userUuid } = params;
    const projectId = await context.getProjectId();
    const baseUrl = (0, api_1.getProjectBaseUrl)(projectId);
    const url = `${baseUrl}/organizations/${organizationId}/members/${userUuid}/`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get member: ${response.status} ${errorText}`);
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
exports.getMemberHandler = getMemberHandler;
const tool = () => ({
    name: "get-member",
    description: `
        - Get a specific member by organization ID and user UUID.
        - Returns detailed information about the member.
    `,
    schema,
    handler: exports.getMemberHandler,
});
exports.default = tool;
