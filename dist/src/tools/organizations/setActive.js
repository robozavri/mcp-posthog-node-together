"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setActiveHandler = void 0;
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.OrganizationSetActiveSchema;
const setActiveHandler = async (context, params) => {
    const { orgId } = params;
    await context.cache.set("orgId", orgId);
    return {
        content: [{ type: "text", text: `Switched to organization ${orgId}` }],
    };
};
exports.setActiveHandler = setActiveHandler;
const tool = () => ({
    name: "organization-set-active",
    description: `
        - Use this tool to set the active organization.
    `,
    schema,
    handler: exports.setActiveHandler,
});
exports.default = tool;
