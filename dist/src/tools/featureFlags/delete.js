"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHandler = void 0;
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.FeatureFlagDeleteSchema;
const deleteHandler = async (context, params) => {
    const { flagKey } = params;
    const projectId = await context.getProjectId();
    const flagResult = await context.api.featureFlags({ projectId }).findByKey({ key: flagKey });
    if (!flagResult.success) {
        throw new Error(`Failed to find feature flag: ${flagResult.error.message}`);
    }
    if (!flagResult.data) {
        return {
            content: [{ type: "text", text: "Feature flag is already deleted." }],
        };
    }
    const deleteResult = await context.api.featureFlags({ projectId }).delete({
        flagId: flagResult.data.id,
    });
    if (!deleteResult.success) {
        throw new Error(`Failed to delete feature flag: ${deleteResult.error.message}`);
    }
    return {
        content: [{ type: "text", text: JSON.stringify(deleteResult.data) }],
    };
};
exports.deleteHandler = deleteHandler;
const tool = () => ({
    name: "delete-feature-flag",
    description: `
        - Use this tool to delete a feature flag in the project.
    `,
    schema,
    handler: exports.deleteHandler,
});
exports.default = tool;
