"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.ExperimentUpdateSchema;
const updateHandler = async (context, params) => {
    const { experimentId, data } = params;
    const projectId = await context.getProjectId();
    const payload = {};
    if (data.name !== undefined)
        payload.name = data.name;
    if (data.description !== undefined)
        payload.description = data.description;
    if (data.featureFlagKey !== undefined)
        payload.feature_flag_key = data.featureFlagKey;
    if (data.parameters !== undefined)
        payload.parameters = data.parameters;
    if (data.startDate !== undefined)
        payload.start_date = data.startDate;
    if (data.endDate !== undefined)
        payload.end_date = data.endDate;
    if (data.secondaryMetrics !== undefined)
        payload.secondary_metrics = data.secondaryMetrics;
    if (data.exposureCohortId !== undefined)
        payload.exposure_cohort_id = data.exposureCohortId;
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/experiments/${experimentId}/`;
    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update experiment: ${response.status} ${errorText}`);
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
exports.updateHandler = updateHandler;
const tool = () => ({
    name: "update-experiment",
    description: `
        - Update an experiment's properties by ID.
        - Supports updating name, description, metrics, and parameters.
        - Returns the updated experiment details.
    `,
    schema,
    handler: exports.updateHandler,
});
exports.default = tool;
