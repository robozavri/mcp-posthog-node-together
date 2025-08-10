import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { SessionRecordingUpdateSchema } from "@/schema/tool-inputs";

const schema = SessionRecordingUpdateSchema;

type Params = z.infer<typeof schema>;

export const updateHandler = async (context: Context, params: Params) => {
	const { recordingId, data } = params;
	const projectId = await context.getProjectId();

	const payload: any = {};
	if (data.bookmarked !== undefined) payload.bookmarked = data.bookmarked;
	if (data.notes !== undefined) payload.notes = data.notes;
	if (data.status !== undefined) payload.status = data.status;

	const url = `${getProjectBaseUrl(projectId)}/session_recordings/${recordingId}/`;
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
		throw new Error(`Failed to update session recording: ${response.status} ${errorText}`);
	}

	const recording = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(recording, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "update-session-recording",
	description: `
        - Update a session recording's properties by ID.
        - Supports updating bookmarked status, notes, and recording status.
        - Returns the updated recording details.
    `,
	schema,
	handler: updateHandler,
});

export default tool; 