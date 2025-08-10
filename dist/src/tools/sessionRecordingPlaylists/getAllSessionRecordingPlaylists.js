"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSessionRecordingPlaylistsHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.SessionRecordingPlaylistGetAllSchema;
const getAllSessionRecordingPlaylistsHandler = async (context, params) => {
    const { data } = params;
    const { projectId, ...filters } = data;
    const queryParams = new URLSearchParams();
    if (filters.limit)
        queryParams.append("limit", filters.limit.toString());
    if (filters.offset)
        queryParams.append("offset", filters.offset.toString());
    const url = `${(0, api_1.getProjectBaseUrl)(String(projectId))}/session_recording_playlists/?${queryParams.toString()}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get session recording playlists: ${response.status} ${errorText}`);
    }
    const playlists = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(playlists, null, 2),
            },
        ],
    };
};
exports.getAllSessionRecordingPlaylistsHandler = getAllSessionRecordingPlaylistsHandler;
const tool = () => ({
    name: "get-all-session-recording-playlists",
    description: `
        - List all session recording playlists in the project.
        - Supports pagination with limit/offset.
        - Returns paginated results with next/previous links.
    `,
    schema,
    handler: exports.getAllSessionRecordingPlaylistsHandler,
});
exports.default = tool;
