"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.SessionRecordingUpdateSchema;
const updateHandler = async (context, params) => {
    const { recordingId, data } = params;
    const projectId = await context.getProjectId();
    const payload = {};
    if (data.bookmarked !== undefined)
        payload.bookmarked = data.bookmarked;
    if (data.notes !== undefined)
        payload.notes = data.notes;
    if (data.status !== undefined)
        payload.status = data.status;
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/session_recordings/${recordingId}/`;
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
        throw new Error(`Failed to update session recording: ${response.status} ${errorText}`);
    }
    const recording = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(recording, null, 2),
            },
        ],
    };
};
exports.updateHandler = updateHandler;
const tool = () => ({
    name: "update-session-recording",
    description: `
        - Update a session recording's properties by ID.
        - Supports updating bookmarked status, notes, and recording status.
        - Returns the updated recording details.
    `,
    schema,
    handler: exports.updateHandler,
});
exports.default = tool;
