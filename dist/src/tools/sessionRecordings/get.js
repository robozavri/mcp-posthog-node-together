"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.SessionRecordingGetSchema;
const getHandler = async (context, params) => {
    const { recordingId } = params;
    const projectId = await context.getProjectId();
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/session_recordings/${recordingId}/`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get session recording: ${response.status} ${errorText}`);
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
exports.getHandler = getHandler;
const tool = () => ({
    name: "get-session-recording",
    description: `
        - Get a specific session recording by ID.
        - Returns detailed information about the recording including events and metadata.
    `,
    schema,
    handler: exports.getHandler,
});
exports.default = tool;
