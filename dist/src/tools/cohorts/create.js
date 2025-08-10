"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.CohortCreateSchema;
const createHandler = async (context, params) => {
    const { data } = params;
    const projectId = await context.getProjectId();
    const payload = {
        name: data.name,
        groups: data.groups,
        description: data.description,
        is_static: data.isStatic,
        tags: data.tags,
    };
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/cohorts/`;
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
        throw new Error(`Failed to create cohort: ${response.status} ${errorText}`);
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
exports.createHandler = createHandler;
const tool = () => ({
    name: "create-cohort",
    description: `
        - Create a new cohort with the specified name, filters, and properties.
        - Supports static and dynamic cohorts.
        - Returns the created cohort details.
    `,
    schema,
    handler: exports.createHandler,
});
exports.default = tool;
