"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatsHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.SurveyGetStatsSchema;
const getStatsHandler = async (context, params) => {
    const { surveyId } = params;
    const projectId = await context.getProjectId();
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/surveys/${surveyId}/stats/`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get survey stats: ${response.status} ${errorText}`);
    }
    const stats = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(stats, null, 2),
            },
        ],
    };
};
exports.getStatsHandler = getStatsHandler;
const tool = () => ({
    name: "get-survey-stats",
    description: `
        - Get survey statistics and summary data.
        - Returns response counts, completion rates, and other metrics.
        - Useful for analyzing survey performance.
    `,
    schema,
    handler: exports.getStatsHandler,
});
exports.default = tool;
