"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.PersonUpdateSchema;
const updateHandler = async (context, params) => {
    const { personId, data } = params;
    const projectId = await context.getProjectId();
    const payload = {
        ...data.properties,
        ...data.$set,
        ...data.$set_once,
    };
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/persons/${encodeURIComponent(personId)}/`;
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
        throw new Error(`Failed to update person: ${response.status} ${errorText}`);
    }
    const person = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(person, null, 2),
            },
        ],
    };
};
exports.updateHandler = updateHandler;
const tool = () => ({
    name: "update-person",
    description: `
        - Update a person's properties by their distinct_id.
        - Supports setting properties with $set and $set_once operations.
        - Returns the updated person details.
    `,
    schema,
    handler: exports.updateHandler,
});
exports.default = tool;
