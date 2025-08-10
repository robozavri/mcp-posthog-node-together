"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.FeatureFlagCreateSchema;
const createHandler = async (context, params) => {
    const { name, key, description, filters, active, tags } = params;
    const projectId = await context.getProjectId();
    const flagResult = await context.api.featureFlags({ projectId }).create({
        data: { name, key, description, filters, active, tags },
    });
    if (!flagResult.success) {
        throw new Error(`Failed to create feature flag: ${flagResult.error.message}`);
    }
    const featureFlagWithUrl = {
        ...flagResult.data,
        url: `${(0, api_1.getProjectBaseUrl)(projectId)}/feature_flags/${flagResult.data.id}`,
    };
    return {
        content: [{ type: "text", text: JSON.stringify(featureFlagWithUrl) }],
    };
};
exports.createHandler = createHandler;
const tool = () => ({
    name: "create-feature-flag",
    description: `Creates a new feature flag in the project. Once you have created a feature flag, you should:
     - Ask the user if they want to add it to their codebase
     - Use the "search-docs" tool to find documentation on how to add feature flags to the codebase (search for the right language / framework)
     - Clarify where it should be added and then add it.
    `,
    schema,
    handler: exports.createHandler,
});
exports.default = tool;
