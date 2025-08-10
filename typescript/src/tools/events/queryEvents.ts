import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { EventsQuerySchema } from "@/schema/tool-inputs";

const schema = EventsQuerySchema;

type Params = z.infer<typeof schema>;

export const queryEventsHandler = async (context: Context, params: Params) => {
	const projectId = await context.getProjectId();
	const { data } = params;

	// Build the query payload based on the PostHog Query API
	const payload = {
		query: {
			kind: "HogQLQuery",
			query: data.hogql_query,
		},
		refresh: data.refresh || "blocking",
		client_query_id: data.client_query_id,
	};

	const url = `${getProjectBaseUrl(projectId)}/query/`;
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
		throw new Error(`Failed to query events: ${response.status} ${errorText}`);
	}

	const result = await response.json();

	return {
		content: [
			{
				type: "text",
				text: `Events Query Results:\n${JSON.stringify(result, null, 2)}`,
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "query-events",
	description: `
        - Query events using PostHog's Query API with HogQL.
        - Execute flexible SQL-like queries against your events data.
        - Supports complex filtering, aggregation, and analysis.
        - Examples:
          - "SELECT * FROM events LIMIT 100"
          - "SELECT event, count() FROM events GROUP BY event ORDER BY count() DESC LIMIT 10"
          - "SELECT properties.$current_url, count() FROM events WHERE event = 'pageview' GROUP BY properties.$current_url"
          - "SELECT event, properties.$browser, count() FROM events WHERE timestamp > now() - INTERVAL 7 DAY GROUP BY event, properties.$browser"
    `,
	schema,
	handler: queryEventsHandler,
});

export default tool; 