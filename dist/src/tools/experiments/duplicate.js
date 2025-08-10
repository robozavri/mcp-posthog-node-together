"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.ExperimentDuplicateSchema;
const duplicateHandler = async (context, params) => {
    const { experimentId, name, featureFlagKey } = params;
    const projectId = await context.getProjectId();
    const payload = {
        name,
        feature_flag_key: featureFlagKey,
    };
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/experiments/${experimentId}/duplicate/`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to duplicate experiment: ${response.status} ${errorText}`);
    }
    const experiment = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(experiment, null, 2),
            },
        ],
    };
};
exports.duplicateHandler = duplicateHandler;
const tool = () => ({
    name: "duplicate-experiment",
    description: `
        - Duplicate an existing experiment with a new name and feature flag.
        - Creates a copy of the experiment with all its settings and metrics.
        - Returns the new experiment details.
    `,
    schema,
    handler: exports.duplicateHandler,
});
exports.default = tool;
