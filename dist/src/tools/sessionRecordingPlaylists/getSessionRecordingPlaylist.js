"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionRecordingPlaylistHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.SessionRecordingPlaylistGetSchema;
const getSessionRecordingPlaylistHandler = async (context, params) => {
    const { projectId, playlistId } = params;
    const url = `${(0, api_1.getProjectBaseUrl)(String(projectId))}/session_recording_playlists/${String(playlistId)}/`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get session recording playlist: ${response.status} ${errorText}`);
    }
    const playlist = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(playlist, null, 2),
            },
        ],
    };
};
exports.getSessionRecordingPlaylistHandler = getSessionRecordingPlaylistHandler;
const tool = () => ({
    name: "get-session-recording-playlist",
    description: `
        - Get a specific session recording playlist by ID.
        - Returns detailed information about the playlist including filters and configuration.
    `,
    schema,
    handler: exports.getSessionRecordingPlaylistHandler,
});
exports.default = tool;
