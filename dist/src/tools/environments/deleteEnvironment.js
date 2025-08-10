"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEnvironmentHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.EnvironmentDeleteSchema;
const deleteEnvironmentHandler = async (context, params) => {
    const { projectId, environmentId } = params;
    const url = `${(0, api_1.getProjectBaseUrl)(String(projectId))}/environments/${String(environmentId)}/`;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete environment: ${response.status} ${errorText}`);
    }
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify({ success: true, message: "Environment deleted successfully" }, null, 2),
            },
        ],
    };
};
exports.deleteEnvironmentHandler = deleteEnvironmentHandler;
const tool = () => ({
    name: "delete-environment",
    description: `
        - Delete an environment from the project.
        - Permanently removes the environment and all associated data.
        - Returns success confirmation.
    `,
    schema,
    handler: exports.deleteEnvironmentHandler,
});
exports.default = tool;
