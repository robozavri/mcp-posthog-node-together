import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { SessionRecordingGetSchema } from "@/schema/tool-inputs";

const schema = SessionRecordingGetSchema;

type Params = z.infer<typeof schema>;

export const getHandler = async (context: Context, params: Params) => {
	const { recordingId } = params;
	const projectId = await context.getProjectId();

	const url = `${getProjectBaseUrl(projectId)}/session_recordings/${recordingId}/`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get session recording: ${response.status} ${errorText}`);
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
	name: "get-session-recording",
	description: `
        - Get a specific session recording by ID.
        - Returns detailed information about the recording including events and metadata.
    `,
	schema,
	handler: getHandler,
});

export default tool; 