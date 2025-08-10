"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.EventDefinitionCreateSchema;
const createHandler = async (context, params) => {
    const { data } = params;
    const projectId = await context.getProjectId();
    const payload = {
        name: data.name,
        description: data.description,
        query_usage_30_day: data.query_usage_30_day,
        volume_30_day: data.volume_30_day,
        verified: data.verified,
        owner: data.owner,
        created_at: data.created_at,
        updated_at: data.updated_at,
        last_seen_at: data.last_seen_at,
        last_updated_at: data.last_updated_at,
    };
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/event_definitions/`;
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
        throw new Error(`Failed to create event definition: ${response.status} ${errorText}`);
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
exports.createHandler = createHandler;
const tool = () => ({
    name: "create-event-definition",
    description: `
        - Create a new event definition.
        - Supports custom event metadata and usage tracking.
        - Returns the created event definition details.
    `,
    schema,
    handler: exports.createHandler,
});
exports.default = tool;
