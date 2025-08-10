"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResponsesHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.SurveyGetResponsesSchema;
const getResponsesHandler = async (context, params) => {
    const { surveyId, limit, offset } = params;
    const projectId = await context.getProjectId();
    const queryParams = new URLSearchParams();
    if (limit)
        queryParams.append("limit", limit.toString());
    if (offset)
        queryParams.append("offset", offset.toString());
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/surveys/${surveyId}/responses/?${queryParams.toString()}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get survey responses: ${response.status} ${errorText}`);
    }
    const responses = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(responses, null, 2),
            },
        ],
    };
};
exports.getResponsesHandler = getResponsesHandler;
const tool = () => ({
    name: "get-survey-responses",
    description: `
        - Get all responses for a specific survey.
        - Supports pagination with limit/offset.
        - Returns the list of survey responses.
    `,
    schema,
    handler: exports.getResponsesHandler,
});
exports.default = tool;
