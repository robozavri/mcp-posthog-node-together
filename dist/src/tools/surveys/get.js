"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.SurveyGetSchema;
const getHandler = async (context, params) => {
    const { surveyId } = params;
    const projectId = await context.getProjectId();
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/surveys/${surveyId}/`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get survey: ${response.status} ${errorText}`);
    }
    const survey = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(survey, null, 2),
            },
        ],
    };
};
exports.getHandler = getHandler;
const tool = () => ({
    name: "get-survey",
    description: `
        - Get a specific survey by ID.
        - Returns detailed information about the survey including questions and settings.
    `,
    schema,
    handler: exports.getHandler,
});
exports.default = tool;
