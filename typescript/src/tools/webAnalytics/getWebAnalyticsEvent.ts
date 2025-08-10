import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { WebAnalyticsGetEventSchema } from "@/schema/tool-inputs";

const schema = WebAnalyticsGetEventSchema;

type Params = z.infer<typeof schema>;

export const getWebAnalyticsEventHandler = async (context: Context, params: Params) => {
	const { projectId, eventId } = params;

	const url = `${getProjectBaseUrl(String(projectId))}/web_analytics/events/${String(eventId)}/`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get web analytics event: ${response.status} ${errorText}`);
	}

	const event = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(event, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-web-analytics-event",
	description: `
        - Get a specific web analytics event by ID.
        - Returns detailed information about the event including properties.
    `,
	schema,
	handler: getWebAnalyticsEventHandler,
});

export default tool; 