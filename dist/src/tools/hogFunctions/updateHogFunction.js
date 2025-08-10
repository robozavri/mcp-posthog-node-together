"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHogFunctionHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.HogFunctionUpdateSchema;
const updateHogFunctionHandler = async (context, params) => {
    const { projectId, functionId, data } = params;
    const payload = {};
    if (data.name !== undefined)
        payload.name = data.name;
    if (data.description !== undefined)
        payload.description = data.description;
    if (data.code !== undefined)
        payload.code = data.code;
    if (data.enabled !== undefined)
        payload.enabled = data.enabled;
    if (data.inputs_schema !== undefined)
        payload.inputs_schema = data.inputs_schema;
    if (data.output_schema !== undefined)
        payload.output_schema = data.output_schema;
    const url = `${(0, api_1.getProjectBaseUrl)(String(projectId))}/hog_functions/${String(functionId)}/`;
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
        throw new Error(`Failed to update hog function: ${response.status} ${errorText}`);
    }
    const hogFunction = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(hogFunction, null, 2),
            },
        ],
    };
};
exports.updateHogFunctionHandler = updateHogFunctionHandler;
const tool = () => ({
    name: "update-hog-function",
    description: `
        - Update an existing hog function in the project.
        - Supports updating name, description, code, enabled status, and schemas.
        - Returns the updated hog function details.
    `,
    schema,
    handler: exports.updateHogFunctionHandler,
});
exports.default = tool;
