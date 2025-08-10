"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.ExperimentCreateSchema;
const createHandler = async (context, params) => {
    const { data } = params;
    const projectId = await context.getProjectId();
    const payload = {
        name: data.name,
        description: data.description,
        feature_flag_key: data.featureFlagKey,
        parameters: data.parameters,
        start_date: data.startDate,
        end_date: data.endDate,
        secondary_metrics: data.secondaryMetrics,
        exposure_cohort_id: data.exposureCohortId,
    };
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/experiments/`;
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
        throw new Error(`Failed to create experiment: ${response.status} ${errorText}`);
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
exports.createHandler = createHandler;
const tool = () => ({
    name: "create-experiment",
    description: `
        - Create a new A/B test experiment.
        - Supports feature flags, metrics, and exposure cohorts.
        - Returns the created experiment details.
    `,
    schema,
    handler: exports.createHandler,
});
exports.default = tool;
