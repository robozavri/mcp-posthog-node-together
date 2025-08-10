"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.CohortGetSchema;
const getHandler = async (context, params) => {
    const { cohortId } = params;
    const projectId = await context.getProjectId();
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/cohorts/${cohortId}/`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get cohort: ${response.status} ${errorText}`);
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
exports.getHandler = getHandler;
const tool = () => ({
    name: "get-cohort",
    description: `
        - Get a specific cohort by ID.
        - Returns detailed information about the cohort including filters and members.
    `,
    schema,
    handler: exports.getHandler,
});
exports.default = tool;
