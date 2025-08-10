import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { SessionRecordingPlaylistCreateSchema } from "@/schema/tool-inputs";

const schema = SessionRecordingPlaylistCreateSchema;

type Params = z.infer<typeof schema>;

export const createSessionRecordingPlaylistHandler = async (context: Context, params: Params) => {
	const { data } = params;

	const payload = {
		name: data.name,
		description: data.description,
		filters: data.filters,
		derived_name: data.derived_name,
		short_id: data.short_id,
	};

	const url = `${getProjectBaseUrl(String(data.projectId))}/session_recording_playlists/`;
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

const tool = (): Tool<typeof schema> => ({
	name: "create-session-recording-playlist",
	description: `
        - Create a new session recording playlist in the project.
        - Supports custom name, description, filters, derived name, and short ID.
        - Returns the created playlist details.
    `,
	schema,
	handler: createSessionRecordingPlaylistHandler,
});

export default tool; 