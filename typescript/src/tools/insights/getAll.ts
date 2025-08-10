import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { InsightGetAllSchema } from "@/schema/tool-inputs";

const schema = InsightGetAllSchema;

type Params = z.infer<typeof schema>;

export const getAllHandler = async (context: Context, params: Params) => {
	const projectId = await context.getProjectId();
	const { data } = params;

	const queryParams = new URLSearchParams();
	if (data?.limit) queryParams.append("limit", data.limit.toString());
	if (data?.offset) queryParams.append("offset", data.offset.toString());
	if (data?.saved) queryParams.append("saved", data.saved.toString());
	if (data?.favorited) queryParams.append("favorited", data.favorited.toString());
	if (data?.search) queryParams.append("search", data.search);

	const url = `${getProjectBaseUrl(projectId)}/insights/?${queryParams.toString()}`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get insights: ${response.status} ${errorText}`);
	}

	const insights = await response.json();

	// Add URLs to insights for easier access
	const insightsWithUrls = insights.results?.map((insight: any) => ({
		...insight,
		url: `${getProjectBaseUrl(projectId)}/insights/${insight.short_id}`,
	})) || insights;

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(insightsWithUrls, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "insights-get-all",
	description: `
        - Get all insights in the project with optional filtering.
        - Can filter by saved status, favorited status, or search term.
        - Supports pagination with limit/offset.
        - Returns insights with their URLs for easy access.
    `,
	schema,
	handler: getAllHandler,
});

export default tool;
