import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { SessionRecordingPlaylistGetAllSchema } from "@/schema/tool-inputs";

const schema = SessionRecordingPlaylistGetAllSchema;

type Params = z.infer<typeof schema>;

export const getAllSessionRecordingPlaylistsHandler = async (context: Context, params: Params) => {
	const { data } = params;
	const { projectId, ...filters } = data;

	const queryParams = new URLSearchParams();
	if (filters.limit) queryParams.append("limit", filters.limit.toString());
	if (filters.offset) queryParams.append("offset", filters.offset.toString());

	const url = `${getProjectBaseUrl(String(projectId))}/session_recording_playlists/?${queryParams.toString()}`;
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

const tool = (): Tool<typeof schema> => ({
	name: "get-all-session-recording-playlists",
	description: `
        - List all session recording playlists in the project.
        - Supports pagination with limit/offset.
        - Returns paginated results with next/previous links.
    `,
	schema,
	handler: getAllSessionRecordingPlaylistsHandler,
});

export default tool; 