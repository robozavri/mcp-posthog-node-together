import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { FunnelGetUsersSchema } from "@/schema/tool-inputs";

const schema = FunnelGetUsersSchema;

type Params = z.infer<typeof schema>;

export const getFunnelUsersHandler = async (context: Context, params: Params) => {
	const { projectId, insightId, step, status, limit, offset } = params;

	// Build query parameters for the funnel users endpoint
	const queryParams = new URLSearchParams();
	queryParams.append("step", step.toString());
	queryParams.append("status", status);
	if (limit) queryParams.append("limit", limit.toString());
	if (offset) queryParams.append("offset", offset.toString());

	const url = `${getProjectBaseUrl(String(projectId))}/insights/${insightId}/persons/?${queryParams.toString()}`;
	const response = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get funnel users: ${response.status} ${errorText}`);
	}

	const result = await response.json();

	return {
		content: [
			{
				type: "text",
				text: `Found ${result.results?.length || 0} users who ${status} at step ${step}:\n${JSON.stringify(result, null, 2)}`,
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-funnel-users",
	description: `
        - Get users who completed or dropped at a specific funnel step.
        - Useful for understanding who is struggling or succeeding in your funnel.
        - Can be used to create cohorts for further analysis.
        - Returns paginated list of users with their properties and behavior.
    `,
	schema,
	handler: getFunnelUsersHandler,
});

export default tool; 