"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllHandler = void 0;
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.FeatureFlagGetAllSchema;
const getAllHandler = async (context, _params) => {
    const projectId = await context.getProjectId();
    const flagsResult = await context.api.featureFlags({ projectId }).list();
    if (!flagsResult.success) {
        throw new Error(`Failed to get feature flags: ${flagsResult.error.message}`);
    }
    return { content: [{ type: "text", text: JSON.stringify(flagsResult.data) }] };
};
exports.getAllHandler = getAllHandler;
const tool = () => ({
    name: "feature-flag-get-all",
    description: `
        - Use this tool to get all feature flags in the project.
    `,
    schema,
    handler: exports.getAllHandler,
});
exports.default = tool;
