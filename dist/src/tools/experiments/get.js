"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.ExperimentGetSchema;
const getHandler = async (context, params) => {
    const { experimentId } = params;
    const projectId = await context.getProjectId();
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/experiments/${experimentId}/`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get experiment: ${response.status} ${errorText}`);
    }
    const experiment = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(experiment, null, 2),
            },
        ],
    };
};
exports.getHandler = getHandler;
const tool = () => ({
    name: "get-experiment",
    description: `
        - Get a specific experiment by ID.
        - Returns detailed information about the experiment including metrics and results.
    `,
    schema,
    handler: exports.getHandler,
});
exports.default = tool;
