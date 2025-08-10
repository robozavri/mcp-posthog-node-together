"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectsHandler = void 0;
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.ProjectGetAllSchema;
const getProjectsHandler = async (context, _params) => {
    const orgId = await context.getOrgID();
    const projectsResult = await context.api.organizations().projects({ orgId }).list();
    if (!projectsResult.success) {
        throw new Error(`Failed to get projects: ${projectsResult.error.message}`);
    }
    return {
        content: [{ type: "text", text: JSON.stringify(projectsResult.data) }],
    };
};
exports.getProjectsHandler = getProjectsHandler;
const tool = () => ({
    name: "projects-get",
    description: `
        - Fetches projects that the user has access to - the orgId is optional. 
        - Use this tool before you use any other tools (besides organization-* and docs-search) to allow user to select the project they want to use for subsequent requests.
    `,
    schema,
    handler: exports.getProjectsHandler,
});
exports.default = tool;
