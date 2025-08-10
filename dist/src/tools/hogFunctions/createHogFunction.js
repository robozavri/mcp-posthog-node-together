"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHogFunctionHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.HogFunctionCreateSchema;
const createHogFunctionHandler = async (context, params) => {
    const { data } = params;
    const payload = {
        name: data.name,
        description: data.description,
        code: data.code,
        enabled: data.enabled,
        inputs_schema: data.inputs_schema,
        output_schema: data.output_schema,
    };
    const url = `${(0, api_1.getProjectBaseUrl)(String(data.projectId))}/hog_functions/`;
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
        throw new Error(`Failed to create hog function: ${response.status} ${errorText}`);
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
exports.createHogFunctionHandler = createHogFunctionHandler;
const tool = () => ({
    name: "create-hog-function",
    description: `
        - Create a new hog function in the project.
        - Supports custom name, description, code, enabled status, and schemas.
        - Returns the created hog function details.
    `,
    schema,
    handler: exports.createHogFunctionHandler,
});
exports.default = tool;
