"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.EventDefinitionUpdateSchema;
const updateHandler = async (context, params) => {
    const { eventName, data } = params;
    const projectId = await context.getProjectId();
    const payload = {};
    if (data.description !== undefined)
        payload.description = data.description;
    if (data.verified !== undefined)
        payload.verified = data.verified;
    if (data.owner !== undefined)
        payload.owner = data.owner;
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/event_definitions/${eventName}/`;
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
        throw new Error(`Failed to update event definition: ${response.status} ${errorText}`);
    }
    const eventDefinition = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(eventDefinition, null, 2),
            },
        ],
    };
};
exports.updateHandler = updateHandler;
const tool = () => ({
    name: "update-event-definition",
    description: `
        - Update an event definition's properties by name.
        - Supports updating description, verification status, and owner.
        - Returns the updated event definition details.
    `,
    schema,
    handler: exports.updateHandler,
});
exports.default = tool;
