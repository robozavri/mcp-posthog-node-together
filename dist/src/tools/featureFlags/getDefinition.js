"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefinitionHandler = void 0;
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.FeatureFlagGetDefinitionSchema;
const getDefinitionHandler = async (context, { flagId, flagKey }) => {
    if (!flagId && !flagKey) {
        return {
            content: [
                {
                    type: "text",
                    text: "Error: Either flagId or flagKey must be provided.",
                },
            ],
        };
    }
    const projectId = await context.getProjectId();
    if (flagId) {
        const flagResult = await context.api
            .featureFlags({ projectId })
            .get({ flagId: String(flagId) });
        if (!flagResult.success) {
            throw new Error(`Failed to get feature flag: ${flagResult.error.message}`);
        }
        return {
            content: [{ type: "text", text: JSON.stringify(flagResult.data) }],
        };
    }
    if (flagKey) {
        const flagResult = await context.api
            .featureFlags({ projectId })
            .findByKey({ key: flagKey });
        if (!flagResult.success) {
            throw new Error(`Failed to find feature flag: ${flagResult.error.message}`);
        }
        if (flagResult.data) {
            return {
                content: [{ type: "text", text: JSON.stringify(flagResult.data) }],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: `Error: Flag with key "${flagKey}" not found.`,
                },
            ],
        };
    }
    return {
        content: [
            {
                type: "text",
                text: "Error: Could not determine or find the feature flag.",
            },
        ],
    };
};
exports.getDefinitionHandler = getDefinitionHandler;
const tool = () => ({
    name: "feature-flag-get-definition",
    description: `
        - Use this tool to get the definition of a feature flag. 
        - You can provide either the flagId or the flagKey. 
        - If you provide both, the flagId will be used.
    `,
    schema,
    handler: exports.getDefinitionHandler,
});
exports.default = tool;
