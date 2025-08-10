"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrganizationsHandler = void 0;
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.OrganizationGetAllSchema;
const getOrganizationsHandler = async (context, _params) => {
    const orgsResult = await context.api.organizations().list();
    if (!orgsResult.success) {
        throw new Error(`Failed to get organizations: ${orgsResult.error.message}`);
    }
    return {
        content: [{ type: "text", text: JSON.stringify(orgsResult.data) }],
    };
};
exports.getOrganizationsHandler = getOrganizationsHandler;
const tool = () => ({
    name: "organizations-get",
    description: `
        - Use this tool to get the organizations the user has access to.
    `,
    schema,
    handler: exports.getOrganizationsHandler,
});
exports.default = tool;
