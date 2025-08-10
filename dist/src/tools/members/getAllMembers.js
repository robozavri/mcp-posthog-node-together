"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMembersHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.MemberGetAllSchema;
const getAllMembersHandler = async (context, params) => {
    const { data } = params;
    const { organizationId } = data;
    const queryParams = new URLSearchParams();
    if (data?.limit)
        queryParams.append("limit", data.limit.toString());
    if (data?.offset)
        queryParams.append("offset", data.offset.toString());
    const url = `${(0, api_1.getProjectBaseUrl)(context)}/organizations/${organizationId}/members/?${queryParams.toString()}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get members: ${response.status} ${errorText}`);
    }
    const members = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(members, null, 2),
            },
        ],
    };
};
exports.getAllMembersHandler = getAllMembersHandler;
const tool = () => ({
    name: "get-all-members",
    description: `
        - List all members in the organization.
        - Supports pagination with limit/offset.
        - Returns paginated results with next/previous links.
    `,
    schema,
    handler: exports.getAllMembersHandler,
});
exports.default = tool;
