"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSessionRecordingPlaylistHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.SessionRecordingPlaylistDeleteSchema;
const deleteSessionRecordingPlaylistHandler = async (context, params) => {
    const { projectId, playlistId } = params;
    const url = `${(0, api_1.getProjectBaseUrl)(String(projectId))}/session_recording_playlists/${String(playlistId)}/`;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete session recording playlist: ${response.status} ${errorText}`);
    }
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify({ success: true, message: "Session recording playlist deleted successfully" }, null, 2),
            },
        ],
    };
};
exports.deleteSessionRecordingPlaylistHandler = deleteSessionRecordingPlaylistHandler;
const tool = () => ({
    name: "delete-session-recording-playlist",
    description: `
        - Delete a session recording playlist from the project.
        - Permanently removes the playlist and all associated data.
        - Returns success confirmation.
    `,
    schema,
    handler: exports.deleteSessionRecordingPlaylistHandler,
});
exports.default = tool;
