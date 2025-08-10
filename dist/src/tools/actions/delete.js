"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.ActionDeleteSchema;
const deleteHandler = async (context, params) => {
    const { actionId } = params;
    const projectId = await context.getProjectId();
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/actions/${actionId}/`;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete action: ${response.status} ${errorText}`);
    }
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify({ success: true, message: "Action deleted successfully" }, null, 2),
            },
        ],
    };
};
exports.deleteHandler = deleteHandler;
const tool = () => ({
    name: "delete-action",
    description: `
        - Delete an action by ID.
        - This action cannot be undone.
        - Returns success confirmation.
    `,
    schema,
    handler: exports.deleteHandler,
});
exports.default = tool;
