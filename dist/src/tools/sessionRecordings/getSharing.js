"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSharingHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.SessionRecordingGetSharingSchema;
const getSharingHandler = async (context, params) => {
    const { recordingId } = params;
    const projectId = await context.getProjectId();
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/session_recordings/${recordingId}/sharing/`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get session recording sharing: ${response.status} ${errorText}`);
    }
    const sharing = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(sharing, null, 2),
            },
        ],
    };
};
exports.getSharingHandler = getSharingHandler;
const tool = () => ({
    name: "get-session-recording-sharing",
    description: `
        - Get sharing information for a session recording.
        - Returns sharing settings and access controls.
    `,
    schema,
    handler: exports.getSharingHandler,
});
exports.default = tool;
