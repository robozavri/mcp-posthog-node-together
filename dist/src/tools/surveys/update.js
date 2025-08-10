"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.SurveyUpdateSchema;
const updateHandler = async (context, params) => {
    const { surveyId, data } = params;
    const projectId = await context.getProjectId();
    const payload = {};
    if (data.name !== undefined)
        payload.name = data.name;
    if (data.description !== undefined)
        payload.description = data.description;
    if (data.type !== undefined)
        payload.type = data.type;
    if (data.questions !== undefined)
        payload.questions = data.questions;
    if (data.conditions !== undefined)
        payload.conditions = data.conditions;
    if (data.appearance !== undefined)
        payload.appearance = data.appearance;
    if (data.start_date !== undefined)
        payload.start_date = data.start_date;
    if (data.end_date !== undefined)
        payload.end_date = data.end_date;
    if (data.linked_flag_id !== undefined)
        payload.linked_flag_id = data.linked_flag_id;
    if (data.archived !== undefined)
        payload.archived = data.archived;
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/surveys/${surveyId}/`;
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
        throw new Error(`Failed to update survey: ${response.status} ${errorText}`);
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
exports.updateHandler = updateHandler;
const tool = () => ({
    name: "update-survey",
    description: `
        - Update a survey's properties by ID.
        - Supports updating name, description, questions, and settings.
        - Returns the updated survey details.
    `,
    schema,
    handler: exports.updateHandler,
});
exports.default = tool;
