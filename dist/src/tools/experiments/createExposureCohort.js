"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExposureCohortHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.ExperimentCreateExposureCohortSchema;
const createExposureCohortHandler = async (context, params) => {
    const { experimentId, name, featureFlagKey } = params;
    const projectId = await context.getProjectId();
    const payload = {
        name,
        feature_flag_key: featureFlagKey,
    };
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/experiments/${experimentId}/create_exposure_cohort_for_experiment/`;
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
        throw new Error(`Failed to create exposure cohort: ${response.status} ${errorText}`);
    }
    const cohort = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(cohort, null, 2),
            },
        ],
    };
};
exports.createExposureCohortHandler = createExposureCohortHandler;
const tool = () => ({
    name: "create-exposure-cohort",
    description: `
        - Create an exposure cohort for an experiment.
        - Automatically creates a cohort based on the experiment's feature flag.
        - Returns the created cohort details.
    `,
    schema,
    handler: exports.createExposureCohortHandler,
});
exports.default = tool;
