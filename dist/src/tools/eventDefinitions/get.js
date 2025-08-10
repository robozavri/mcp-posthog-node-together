"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.EventDefinitionGetSchema;
const getHandler = async (context, params) => {
    const { eventName } = params;
    const projectId = await context.getProjectId();
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/event_definitions/${eventName}/`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get event definition: ${response.status} ${errorText}`);
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
exports.getHandler = getHandler;
const tool = () => ({
    name: "get-event-definition",
    description: `
        - Get a specific event definition by name.
        - Returns detailed information about the event including usage and metadata.
    `,
    schema,
    handler: exports.getHandler,
});
exports.default = tool;
