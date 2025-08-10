"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDetailsHandler = void 0;
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.OrganizationGetDetailsSchema;
const getDetailsHandler = async (context, _params) => {
    const orgId = await context.getOrgID();
    const orgResult = await context.api.organizations().get({ orgId });
    if (!orgResult.success) {
        throw new Error(`Failed to get organization details: ${orgResult.error.message}`);
    }
    return {
        content: [{ type: "text", text: JSON.stringify(orgResult.data) }],
    };
};
exports.getDetailsHandler = getDetailsHandler;
const tool = () => ({
    name: "organization-details-get",
    description: `
        - Use this tool to get the details of the active organization.
    `,
    schema,
    handler: exports.getDetailsHandler,
});
exports.default = tool;
