"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.CohortDuplicateSchema;
const duplicateHandler = async (context, params) => {
    const { cohortId, name, description } = params;
    const projectId = await context.getProjectId();
    const payload = {
        name,
        description,
    };
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/cohorts/${cohortId}/duplicate/`;
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
        throw new Error(`Failed to duplicate cohort: ${response.status} ${errorText}`);
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
exports.duplicateHandler = duplicateHandler;
const tool = () => ({
    name: "duplicate-cohort",
    description: `
        - Duplicate an existing cohort with a new name.
        - Creates a copy of the cohort with all its filters and properties.
        - Returns the new cohort details.
    `,
    schema,
    handler: exports.duplicateHandler,
});
exports.default = tool;
