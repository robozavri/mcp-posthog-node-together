import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { SessionRecordingPlaylistUpdateSchema } from "@/schema/tool-inputs";

const schema = SessionRecordingPlaylistUpdateSchema;

type Params = z.infer<typeof schema>;

export const updateSessionRecordingPlaylistHandler = async (context: Context, params: Params) => {
	const { projectId, playlistId, data } = params;

	const payload: any = {};
	if (data.name !== undefined) payload.name = data.name;
	if (data.description !== undefined) payload.description = data.description;
	if (data.filters !== undefined) payload.filters = data.filters;
	if (data.derived_name !== undefined) payload.derived_name = data.derived_name;
	if (data.short_id !== undefined) payload.short_id = data.short_id;

	const url = `${getProjectBaseUrl(String(projectId))}/session_recording_playlists/${String(playlistId)}/`;
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
		throw new Error(`Failed to update session recording playlist: ${response.status} ${errorText}`);
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
	name: "update-session-recording-playlist",
	description: `
        - Update an existing session recording playlist in the project.
        - Supports updating name, description, filters, derived name, and short ID.
        - Returns the updated playlist details.
    `,
	schema,
	handler: updateSessionRecordingPlaylistHandler,
});

export default tool; 