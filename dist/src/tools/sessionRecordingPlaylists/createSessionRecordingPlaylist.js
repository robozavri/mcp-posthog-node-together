"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSessionRecordingPlaylistHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.SessionRecordingPlaylistCreateSchema;
const createSessionRecordingPlaylistHandler = async (context, params) => {
    const { data } = params;
    const payload = {
        name: data.name,
        description: data.description,
        filters: data.filters,
        derived_name: data.derived_name,
        short_id: data.short_id,
    };
    const url = `${(0, api_1.getProjectBaseUrl)(String(data.projectId))}/session_recording_playlists/`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create session recording playlist: ${response.status} ${errorText}`);
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
exports.createSessionRecordingPlaylistHandler = createSessionRecordingPlaylistHandler;
const tool = () => ({
    name: "create-session-recording-playlist",
    description: `
        - Create a new session recording playlist in the project.
        - Supports custom name, description, filters, derived name, and short ID.
        - Returns the created playlist details.
    `,
    schema,
    handler: exports.createSessionRecordingPlaylistHandler,
});
exports.default = tool;
