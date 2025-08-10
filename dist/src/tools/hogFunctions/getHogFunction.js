"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHogFunctionHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.HogFunctionGetSchema;
const getHogFunctionHandler = async (context, params) => {
    const { projectId, functionId } = params;
    const url = `${(0, api_1.getProjectBaseUrl)(String(projectId))}/hog_functions/${String(functionId)}/`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get hog function: ${response.status} ${errorText}`);
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
exports.getHogFunctionHandler = getHogFunctionHandler;
const tool = () => ({
    name: "get-hog-function",
    description: `
        - Get a specific hog function by ID.
        - Returns detailed information about the hog function including code and configuration.
    `,
    schema,
    handler: exports.getHogFunctionHandler,
});
exports.default = tool;
