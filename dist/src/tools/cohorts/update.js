"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.CohortUpdateSchema;
const updateHandler = async (context, params) => {
    const { cohortId, data } = params;
    const projectId = await context.getProjectId();
    const payload = {};
    if (data.name !== undefined)
        payload.name = data.name;
    if (data.groups !== undefined)
        payload.groups = data.groups;
    if (data.description !== undefined)
        payload.description = data.description;
    if (data.isStatic !== undefined)
        payload.is_static = data.isStatic;
    if (data.tags !== undefined)
        payload.tags = data.tags;
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/cohorts/${cohortId}/`;
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
        throw new Error(`Failed to update cohort: ${response.status} ${errorText}`);
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
exports.updateHandler = updateHandler;
const tool = () => ({
    name: "update-cohort",
    description: `
        - Update a cohort's properties by ID.
        - Supports updating name, filters, description, and tags.
        - Returns the updated cohort details.
    `,
    schema,
    handler: exports.updateHandler,
});
exports.default = tool;
