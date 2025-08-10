import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { WebAnalyticsCreateEventSchema } from "@/schema/tool-inputs";

const schema = WebAnalyticsCreateEventSchema;

type Params = z.infer<typeof schema>;

export const createWebAnalyticsEventHandler = async (context: Context, params: Params) => {
	const { data } = params;

	const payload = {
		event: data.event,
		properties: data.properties,
		timestamp: data.timestamp,
		distinct_id: data.distinct_id,
		$set: data.$set,
		$set_once: data.$set_once,
	};

	const url = `${getProjectBaseUrl(String(data.projectId))}/web_analytics/`;
	const response = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to create web analytics event: ${response.status} ${errorText}`);
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
	name: "create-web-analytics-event",
	description: `
        - Create a new web analytics event.
        - Supports custom event properties and user identification.
        - Returns the created event details.
    `,
	schema,
	handler: createWebAnalyticsEventHandler,
});

export default tool; 