import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { SessionRecordingPlaylistGetSchema } from "@/schema/tool-inputs";

const schema = SessionRecordingPlaylistGetSchema;

type Params = z.infer<typeof schema>;

export const getSessionRecordingPlaylistHandler = async (context: Context, params: Params) => {
	const { projectId, playlistId } = params;

	const url = `${getProjectBaseUrl(String(projectId))}/session_recording_playlists/${String(playlistId)}/`;
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

const tool = (): Tool<typeof schema> => ({
	name: "get-session-recording-playlist",
	description: `
        - Get a specific session recording playlist by ID.
        - Returns detailed information about the playlist including filters and configuration.
    `,
	schema,
	handler: getSessionRecordingPlaylistHandler,
});

export default tool; 