import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { PersonGetTrendsSchema } from "@/schema/tool-inputs";

const schema = PersonGetTrendsSchema;

type Params = z.infer<typeof schema>;

export const getTrendsHandler = async (context: Context, params: Params) => {
	const { dateFrom, interval, filters } = params;
	const projectId = await context.getProjectId();

	const queryParams = new URLSearchParams();
	if (dateFrom) queryParams.append("date_from", dateFrom);
	if (interval) queryParams.append("interval", interval);
	if (filters) {
		Object.entries(filters).forEach(([key, value]) => {
			queryParams.append(`filters[${key}]`, JSON.stringify(value));
		});
	}

	const url = `${getProjectBaseUrl(projectId)}/persons/trends/?${queryParams.toString()}`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get person trends: ${response.status} ${errorText}`);
	}

	const trends = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(trends, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-person-trends",
	description: `
        - Get per-user trend summaries (counts, activity).
        - Shows user engagement trends over time.
        - Supports filtering by date range and additional filters.
    `,
	schema,
	handler: getTrendsHandler,
});

export default tool; 