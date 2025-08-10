import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { SessionRecordingRefreshSharingSchema } from "@/schema/tool-inputs";

const schema = SessionRecordingRefreshSharingSchema;

type Params = z.infer<typeof schema>;

export const refreshSharingHandler = async (context: Context, params: Params) => {
	const { recordingId } = params;
	const projectId = await context.getProjectId();

	const url = `${getProjectBaseUrl(projectId)}/session_recordings/${recordingId}/sharing/refresh/`;
	const response = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to refresh session recording sharing: ${response.status} ${errorText}`);
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
	name: "refresh-session-recording-sharing",
	description: `
        - Refresh sharing information for a session recording.
        - Generates new sharing links and access tokens.
        - Returns updated sharing settings.
    `,
	schema,
	handler: refreshSharingHandler,
});

export default tool; 