"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.PropertyDefinitionUpdateSchema;
const updateHandler = async (context, params) => {
    const { propertyKey, data } = params;
    const projectId = await context.getProjectId();
    const payload = {};
    if (data.name !== undefined)
        payload.name = data.name;
    if (data.description !== undefined)
        payload.description = data.description;
    if (data.property_type_format !== undefined)
        payload.property_type_format = data.property_type_format;
    if (data.example !== undefined)
        payload.example = data.example;
    if (data.property_type_definition !== undefined)
        payload.property_type_definition = data.property_type_definition;
    if (data.is_numerical !== undefined)
        payload.is_numerical = data.is_numerical;
    if (data.is_seen_on_filtered_events !== undefined)
        payload.is_seen_on_filtered_events = data.is_seen_on_filtered_events;
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/property_definitions/${propertyKey}/`;
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
        throw new Error(`Failed to update property definition: ${response.status} ${errorText}`);
    }
    const propertyDefinition = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(propertyDefinition, null, 2),
            },
        ],
    };
};
exports.updateHandler = updateHandler;
const tool = () => ({
    name: "update-property-definition",
    description: `
        - Update a property definition's properties by key.
        - Supports updating name, description, format, and metadata.
        - Returns the updated property definition details.
    `,
    schema,
    handler: exports.updateHandler,
});
exports.default = tool;
