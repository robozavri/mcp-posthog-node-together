import { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";

// Schema for funnel query execution
const FunnelQuerySchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	query: z.string().describe("SQL or HogQL query for funnel analysis"),
	query_type: z.enum(["sql", "hogql"]).optional().default("hogql").describe("Query type (sql or hogql)"),
	refresh: z.boolean().optional().describe("Whether to refresh cached results"),
	client_query_id: z.string().optional().describe("Client query ID for tracking"),
});

const schema = z.object({
	data: FunnelQuerySchema,
});

type Params = z.infer<typeof schema>;

export const executeFunnelQueryHandler = async (context: Context, params: Params) => {
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
		throw new Error(`Failed to execute funnel query: ${response.status} ${errorText}`);
	}

	const result = await response.json();

	return {
		content: [
			{
				type: "text",
				text: `Funnel Query Results:\n${JSON.stringify(result, null, 2)}`,
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "execute-funnel-query",
	description: `
        - Execute SQL or HogQL queries for funnel analysis.
        - Useful for custom funnel calculations and complex funnel logic.
        - Can be used to create funnel insights that go beyond the standard funnel UI.
        - Supports both SQL and HogQL query types.
        - Example HogQL query for funnel analysis:
          SELECT 
            event,
            count() as count,
            count() / lag(count()) OVER (ORDER BY step_order) as conversion_rate
          FROM events 
          WHERE event IN ('page_view', 'sign_up', 'purchase')
          GROUP BY event, step_order
          ORDER BY step_order
    `,
	schema,
	handler: executeFunnelQueryHandler,
});

export default tool; 