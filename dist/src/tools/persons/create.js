"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.PersonCreateSchema;
const createHandler = async (context, params) => {
    const { data } = params;
    const projectId = await context.getProjectId();
    const payload = {
        distinct_id: data.distinctId,
        ...data.properties,
        ...data.$set,
        ...data.$set_once,
    };
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/persons/`;
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
        throw new Error(`Failed to create person: ${response.status} ${errorText}`);
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
exports.createHandler = createHandler;
const tool = () => ({
    name: "create-person",
    description: `
        - Create a new person with the specified distinct_id and properties.
        - Supports setting properties with $set and $set_once operations.
        - Returns the created person details.
    `,
    schema,
    handler: exports.createHandler,
});
exports.default = tool;
