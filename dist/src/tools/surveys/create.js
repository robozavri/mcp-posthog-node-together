"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.SurveyCreateSchema;
const createHandler = async (context, params) => {
    const { data } = params;
    const projectId = await context.getProjectId();
    const payload = {
        name: data.name,
        description: data.description,
        type: data.type,
        questions: data.questions,
        conditions: data.conditions,
        appearance: data.appearance,
        start_date: data.start_date,
        end_date: data.end_date,
        linked_flag_id: data.linked_flag_id,
        archived: data.archived,
    };
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/surveys/`;
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
        throw new Error(`Failed to create survey: ${response.status} ${errorText}`);
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
exports.createHandler = createHandler;
const tool = () => ({
    name: "create-survey",
    description: `
        - Create a new survey with questions and settings.
        - Supports different survey types: popover, button, full_screen, api.
        - Returns the created survey details.
    `,
    schema,
    handler: exports.createHandler,
});
exports.default = tool;
