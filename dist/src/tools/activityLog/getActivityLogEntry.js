"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivityLogEntryHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.ActivityLogGetEntrySchema;
const getActivityLogEntryHandler = async (context, params) => {
    const { projectId, logId } = params;
    const url = `${(0, api_1.getProjectBaseUrl)(String(projectId))}/activity_log/${String(logId)}/`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get activity log entry: ${response.status} ${errorText}`);
    }
    const entry = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(entry, null, 2),
            },
        ],
    };
};
exports.getActivityLogEntryHandler = getActivityLogEntryHandler;
const tool = () => ({
    name: "get-activity-log-entry",
    description: `
        - Get a specific activity log entry by ID.
        - Returns detailed information about the activity including user, action, and changes.
    `,
    schema,
    handler: exports.getActivityLogEntryHandler,
});
exports.default = tool;
