import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { FunnelGetUserPathsSchema } from "@/schema/tool-inputs";

const schema = FunnelGetUserPathsSchema;

type Params = z.infer<typeof schema>;

export const getFunnelUserPathsHandler = async (context: Context, params: Params) => {
	const { projectId, insightId, path_type, step, previous_step, limit, offset } = params;

	// Build query parameters for the funnel paths endpoint
	const queryParams = new URLSearchParams();
	queryParams.append("path_type", path_type);
	if (step) queryParams.append("step", step.toString());
	if (previous_step) queryParams.append("previous_step", previous_step.toString());
	if (limit) queryParams.append("limit", limit.toString());
	if (offset) queryParams.append("offset", offset.toString());

	const url = `${getProjectBaseUrl(String(projectId))}/insights/${insightId}/paths/?${queryParams.toString()}`;
	const response = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get funnel user paths: ${response.status} ${errorText}`);
	}

	const result = await response.json();

	return {
		content: [
			{
				type: "text",
				text: `Found user paths for ${path_type} in funnel ${insightId}:\n${JSON.stringify(result, null, 2)}`,
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-funnel-user-paths",
	description: `
        - Get user paths in a funnel for path analysis.
        - Supports different path types: leading to step, between steps, after step, after drop off, before drop off.
        - Helps understand the real user journey vs. the expected funnel.
        - Returns detailed path analysis with conversion rates and user flows.
    `,
	schema,
	handler: getFunnelUserPathsHandler,
});

export default tool; 