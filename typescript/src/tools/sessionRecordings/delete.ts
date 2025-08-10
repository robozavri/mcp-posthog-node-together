import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { SessionRecordingDeleteSchema } from "@/schema/tool-inputs";

const schema = SessionRecordingDeleteSchema;

type Params = z.infer<typeof schema>;

export const deleteHandler = async (context: Context, params: Params) => {
	const { recordingId } = params;
	const projectId = await context.getProjectId();

	const url = `${getProjectBaseUrl(projectId)}/session_recordings/${recordingId}/`;
	const response = await fetch(url, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to delete session recording: ${response.status} ${errorText}`);
	}

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify({ success: true, message: "Session recording deleted successfully" }, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "delete-session-recording",
	description: `
        - Delete a session recording by ID.
        - This action cannot be undone.
        - Returns success confirmation.
    `,
	schema,
	handler: deleteHandler,
});

export default tool; 