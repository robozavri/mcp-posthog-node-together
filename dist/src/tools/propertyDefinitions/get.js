"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.PropertyDefinitionGetSchema;
const getHandler = async (context, params) => {
    const { propertyKey } = params;
    const projectId = await context.getProjectId();
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/property_definitions/${propertyKey}/`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get property definition: ${response.status} ${errorText}`);
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
exports.getHandler = getHandler;
const tool = () => ({
    name: "get-property-definition",
    description: `
        - Get a specific property definition by key.
        - Returns detailed information about the property including type and usage.
    `,
    schema,
    handler: exports.getHandler,
});
exports.default = tool;
