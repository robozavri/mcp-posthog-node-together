"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPersonsHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.CohortGetPersonsSchema;
const getPersonsHandler = async (context, params) => {
    const { cohortId, limit, offset } = params;
    const projectId = await context.getProjectId();
    const queryParams = new URLSearchParams();
    if (limit)
        queryParams.append("limit", limit.toString());
    if (offset)
        queryParams.append("offset", offset.toString());
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/cohorts/${cohortId}/persons/?${queryParams.toString()}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get cohort persons: ${response.status} ${errorText}`);
    }
    const persons = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(persons, null, 2),
            },
        ],
    };
};
exports.getPersonsHandler = getPersonsHandler;
const tool = () => ({
    name: "get-cohort-persons",
    description: `
        - Get all persons (users) in a specific cohort.
        - Supports pagination with limit/offset.
        - Returns the list of persons in the cohort.
    `,
    schema,
    handler: exports.getPersonsHandler,
});
exports.default = tool;
