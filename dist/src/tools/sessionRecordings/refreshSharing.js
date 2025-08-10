"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshSharingHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.SessionRecordingRefreshSharingSchema;
const refreshSharingHandler = async (context, params) => {
    const { recordingId } = params;
    const projectId = await context.getProjectId();
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/session_recordings/${recordingId}/sharing/refresh/`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to refresh session recording sharing: ${response.status} ${errorText}`);
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
exports.refreshSharingHandler = refreshSharingHandler;
const tool = () => ({
    name: "refresh-session-recording-sharing",
    description: `
        - Refresh sharing information for a session recording.
        - Generates new sharing links and access tokens.
        - Returns updated sharing settings.
    `,
    schema,
    handler: exports.refreshSharingHandler,
});
exports.default = tool;
