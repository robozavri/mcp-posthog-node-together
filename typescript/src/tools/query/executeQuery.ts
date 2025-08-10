import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { QueryExecuteSchema } from "@/schema/tool-inputs";

const schema = QueryExecuteSchema;

type Params = z.infer<typeof schema>;

export const executeQueryHandler = async (context: Context, params: Params) => {
	const { data } = params;

	const payload = {
		query: data.query,
		query_type: data.query_type,
		refresh: data.refresh,
		client_query_id: data.client_query_id,
	};

	const url = `${getProjectBaseUrl(String(data.projectId))}/query/`;
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
		throw new Error(`Failed to execute query: ${response.status} ${errorText}`);
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
	name: "execute-query",
	description: `
        - Execute a SQL or HogQL query against the project data.
        - Supports both SQL and HogQL query types.
        - Returns query execution results with status and data.
    `,
	schema,
	handler: executeQueryHandler,
});

export default tool; 