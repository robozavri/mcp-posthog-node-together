import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { QueryGetResultSchema } from "@/schema/tool-inputs";

const schema = QueryGetResultSchema;

type Params = z.infer<typeof schema>;

export const getQueryResultHandler = async (context: Context, params: Params) => {
	const { projectId, queryId } = params;

	const url = `${getProjectBaseUrl(String(projectId))}/query/${String(queryId)}/`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get query result: ${response.status} ${errorText}`);
	}

	const result = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(result, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-query-result",
	description: `
        - Get a specific query result by ID.
        - Returns detailed information about the query execution and results.
    `,
	schema,
	handler: getQueryResultHandler,
});

export default tool; 