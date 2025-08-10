import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { PersonGetStickinessSchema } from "@/schema/tool-inputs";

const schema = PersonGetStickinessSchema;

type Params = z.infer<typeof schema>;

export const getStickinessHandler = async (context: Context, params: Params) => {
	const { dateFrom, interval, properties } = params;
	const projectId = await context.getProjectId();

	const queryParams = new URLSearchParams();
	if (dateFrom) queryParams.append("date_from", dateFrom);
	if (interval) queryParams.append("interval", interval);
	if (properties) {
		Object.entries(properties).forEach(([key, value]) => {
			queryParams.append(`properties[${key}]`, JSON.stringify(value));
		});
	}

	const url = `${getProjectBaseUrl(projectId)}/persons/stickiness/?${queryParams.toString()}`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get person stickiness: ${response.status} ${errorText}`);
	}

	const stickiness = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(stickiness, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-person-stickiness",
	description: `
        - Get stickiness metrics for persons (repeat user engagement).
        - Shows how often users return to your product.
        - Supports filtering by date range and properties.
    `,
	schema,
	handler: getStickinessHandler,
});

export default tool; 