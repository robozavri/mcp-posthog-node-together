"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEnvironmentHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.EnvironmentUpdateSchema;
const updateEnvironmentHandler = async (context, params) => {
    const { projectId, environmentId, data } = params;
    const payload = {};
    if (data.name !== undefined)
        payload.name = data.name;
    if (data.description !== undefined)
        payload.description = data.description;
    if (data.color !== undefined)
        payload.color = data.color;
    if (data.enabled !== undefined)
        payload.enabled = data.enabled;
    const url = `${(0, api_1.getProjectBaseUrl)(String(projectId))}/environments/${String(environmentId)}/`;
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
        throw new Error(`Failed to update environment: ${response.status} ${errorText}`);
    }
    const environment = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(environment, null, 2),
            },
        ],
    };
};
exports.updateEnvironmentHandler = updateEnvironmentHandler;
const tool = () => ({
    name: "update-environment",
    description: `
        - Update an existing environment in the project.
        - Supports updating name, description, color, and enabled status.
        - Returns the updated environment details.
    `,
    schema,
    handler: exports.updateEnvironmentHandler,
});
exports.default = tool;
