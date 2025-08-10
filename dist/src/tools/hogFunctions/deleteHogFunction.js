"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHogFunctionHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.HogFunctionDeleteSchema;
const deleteHogFunctionHandler = async (context, params) => {
    const { projectId, functionId } = params;
    const url = `${(0, api_1.getProjectBaseUrl)(String(projectId))}/hog_functions/${String(functionId)}/`;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete hog function: ${response.status} ${errorText}`);
    }
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify({ success: true, message: "Hog function deleted successfully" }, null, 2),
            },
        ],
    };
};
exports.deleteHogFunctionHandler = deleteHogFunctionHandler;
const tool = () => ({
    name: "delete-hog-function",
    description: `
        - Delete a hog function from the project.
        - Permanently removes the hog function and all associated data.
        - Returns success confirmation.
    `,
    schema,
    handler: exports.deleteHogFunctionHandler,
});
exports.default = tool;
