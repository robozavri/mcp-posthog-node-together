import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { QueryGetResultsSchema } from "@/schema/tool-inputs";

const schema = QueryGetResultsSchema;

type Params = z.infer<typeof schema>;

export const getQueryResultsHandler = async (context: Context, params: Params) => {
	const { data } = params;
	const { projectId, ...filters } = data;

	const queryParams = new URLSearchParams();
	if (filters.limit) queryParams.append("limit", filters.limit.toString());
	if (filters.offset) queryParams.append("offset", filters.offset.toString());
	if (filters.query_type) queryParams.append("query_type", filters.query_type);
	if (filters.status) queryParams.append("status", filters.status);

	const url = `${getProjectBaseUrl(String(projectId))}/query/?${queryParams.toString()}`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get query results: ${response.status} ${errorText}`);
	}

	const results = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(results, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-query-results",
	description: `
        - List query results for the project.
        - Supports pagination and filtering by query type and status.
        - Returns paginated results with next/previous links.
    `,
	schema,
	handler: getQueryResultsHandler,
});

export default tool; 