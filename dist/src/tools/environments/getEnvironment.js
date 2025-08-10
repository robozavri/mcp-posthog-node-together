"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvironmentHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.EnvironmentGetSchema;
const getEnvironmentHandler = async (context, params) => {
    const { projectId, environmentId } = params;
    const url = `${(0, api_1.getProjectBaseUrl)(String(projectId))}/environments/${String(environmentId)}/`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get environment: ${response.status} ${errorText}`);
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
exports.getEnvironmentHandler = getEnvironmentHandler;
const tool = () => ({
    name: "get-environment",
    description: `
        - Get a specific environment by ID.
        - Returns detailed information about the environment including settings and configuration.
    `,
    schema,
    handler: exports.getEnvironmentHandler,
});
exports.default = tool;
