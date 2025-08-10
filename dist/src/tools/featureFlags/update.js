"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.FeatureFlagUpdateSchema;
const updateHandler = async (context, params) => {
    const { flagKey, data } = params;
    const projectId = await context.getProjectId();
    const flagResult = await context.api.featureFlags({ projectId }).update({
        key: flagKey,
        data: data,
    });
    if (!flagResult.success) {
        throw new Error(`Failed to update feature flag: ${flagResult.error.message}`);
    }
    const featureFlagWithUrl = {
        ...flagResult.data,
        url: `${(0, api_1.getProjectBaseUrl)(projectId)}/feature_flags/${flagResult.data.id}`,
    };
    return {
        content: [{ type: "text", text: JSON.stringify(featureFlagWithUrl) }],
    };
};
exports.updateHandler = updateHandler;
const tool = () => ({
    name: "update-feature-flag",
    description: `Update a new feature flag in the project.
    - To enable a feature flag, you should make sure it is active and the rollout percentage is set to 100 for the group you want to target.
    - To disable a feature flag, you should make sure it is inactive, you can keep the rollout percentage as it is.
    `,
    schema,
    handler: exports.updateHandler,
});
exports.default = tool;
