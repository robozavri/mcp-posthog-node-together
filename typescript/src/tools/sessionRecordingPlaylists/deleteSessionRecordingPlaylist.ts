import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { SessionRecordingPlaylistDeleteSchema } from "@/schema/tool-inputs";

const schema = SessionRecordingPlaylistDeleteSchema;

type Params = z.infer<typeof schema>;

export const deleteSessionRecordingPlaylistHandler = async (context: Context, params: Params) => {
	const { projectId, playlistId } = params;

	const url = `${getProjectBaseUrl(String(projectId))}/session_recording_playlists/${String(playlistId)}/`;
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

const tool = (): Tool<typeof schema> => ({
	name: "delete-session-recording-playlist",
	description: `
        - Delete a session recording playlist from the project.
        - Permanently removes the playlist and all associated data.
        - Returns success confirmation.
    `,
	schema,
	handler: deleteSessionRecordingPlaylistHandler,
});

export default tool; 