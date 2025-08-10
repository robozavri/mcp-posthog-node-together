import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { SessionRecordingGetSharingSchema } from "@/schema/tool-inputs";

const schema = SessionRecordingGetSharingSchema;

type Params = z.infer<typeof schema>;

export const getSharingHandler = async (context: Context, params: Params) => {
	const { recordingId } = params;
	const projectId = await context.getProjectId();

	const url = `${getProjectBaseUrl(projectId)}/session_recordings/${recordingId}/sharing/`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get session recording sharing: ${response.status} ${errorText}`);
	}

	const sharing = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(sharing, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-session-recording-sharing",
	description: `
        - Get sharing information for a session recording.
        - Returns sharing settings and access controls.
    `,
	schema,
	handler: getSharingHandler,
});

export default tool; 