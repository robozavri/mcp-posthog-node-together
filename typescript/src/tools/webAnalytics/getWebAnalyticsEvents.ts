import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { WebAnalyticsGetEventsSchema } from "@/schema/tool-inputs";

const schema = WebAnalyticsGetEventsSchema;

type Params = z.infer<typeof schema>;

export const getWebAnalyticsEventsHandler = async (context: Context, params: Params) => {
	const { data } = params;
	const { projectId, ...filters } = data;

	const queryParams = new URLSearchParams();
	if (filters.limit) queryParams.append("limit", filters.limit.toString());
	if (filters.offset) queryParams.append("offset", filters.offset.toString());
	if (filters.date_from) queryParams.append("date_from", filters.date_from);
	if (filters.date_to) queryParams.append("date_to", filters.date_to);
	if (filters.event) queryParams.append("event", filters.event);
	if (filters.pathname) queryParams.append("pathname", filters.pathname);

	const url = `${getProjectBaseUrl(String(projectId))}/web_analytics/events/?${queryParams.toString()}`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get web analytics events: ${response.status} ${errorText}`);
	}

	const events = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(events, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-web-analytics-events",
	description: `
        - List web analytics events for the project.
        - Supports pagination and filtering by date range, event name, and pathname.
        - Returns paginated results with next/previous links.
    `,
	schema,
	handler: getWebAnalyticsEventsHandler,
});

export default tool; 