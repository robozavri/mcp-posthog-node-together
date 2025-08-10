"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnvironmentHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.EnvironmentCreateSchema;
const createEnvironmentHandler = async (context, params) => {
    const { data } = params;
    const payload = {
        name: data.name,
        description: data.description,
        color: data.color,
        enabled: data.enabled,
    };
    const url = `${(0, api_1.getProjectBaseUrl)(String(data.projectId))}/environments/`;
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
        throw new Error(`Failed to create environment: ${response.status} ${errorText}`);
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
exports.createEnvironmentHandler = createEnvironmentHandler;
const tool = () => ({
    name: "create-environment",
    description: `
        - Create a new environment in the project.
        - Supports custom name, description, color, and enabled status.
        - Returns the created environment details.
    `,
    schema,
    handler: exports.createEnvironmentHandler,
});
exports.default = tool;
