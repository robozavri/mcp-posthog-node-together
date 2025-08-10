import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { ActivityLogGetEntrySchema } from "@/schema/tool-inputs";

const schema = ActivityLogGetEntrySchema;

type Params = z.infer<typeof schema>;

export const getActivityLogEntryHandler = async (context: Context, params: Params) => {
	const { projectId, logId } = params;

	const url = `${getProjectBaseUrl(String(projectId))}/activity_log/${String(logId)}/`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get activity log entry: ${response.status} ${errorText}`);
	}

	const entry = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(entry, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-activity-log-entry",
	description: `
        - Get a specific activity log entry by ID.
        - Returns detailed information about the activity including user, action, and changes.
    `,
	schema,
	handler: getActivityLogEntryHandler,
});

export default tool; 