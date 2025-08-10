import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { ActivityLogGetAllSchema } from "@/schema/tool-inputs";

const schema = ActivityLogGetAllSchema;

type Params = z.infer<typeof schema>;

export const getActivityLogHandler = async (context: Context, params: Params) => {
	const { data } = params;
	const { projectId, ...filters } = data;

	const queryParams = new URLSearchParams();
	if (filters.limit) queryParams.append("limit", filters.limit.toString());
	if (filters.offset) queryParams.append("offset", filters.offset.toString());
	if (filters.user_id) queryParams.append("user_id", filters.user_id.toString());
	if (filters.activity) queryParams.append("activity", filters.activity);
	if (filters.scope) queryParams.append("scope", filters.scope);
	if (filters.item_id) queryParams.append("item_id", filters.item_id);
	if (filters.date_from) queryParams.append("date_from", filters.date_from);
	if (filters.date_to) queryParams.append("date_to", filters.date_to);

	const url = `${getProjectBaseUrl(String(projectId))}/activity_log/?${queryParams.toString()}`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get activity log: ${response.status} ${errorText}`);
	}

	const activityLog = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(activityLog, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-activity-log",
	description: `
        - List activity log entries for the project.
        - Supports pagination and filtering by user, activity type, scope, item ID, and date range.
        - Returns paginated results with next/previous links.
    `,
	schema,
	handler: getActivityLogHandler,
});

export default tool; 