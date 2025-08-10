import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { FunnelDeleteSchema } from "@/schema/tool-inputs";

const schema = FunnelDeleteSchema;

type Params = z.infer<typeof schema>;

export const deleteFunnelHandler = async (context: Context, params: Params) => {
	const { projectId, insightId } = params;

	const url = `${getProjectBaseUrl(String(projectId))}/insights/${insightId}/`;
	const response = await fetch(url, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to delete funnel: ${response.status} ${errorText}`);
	}

	return {
		content: [
			{
				type: "text",
				text: `Successfully deleted funnel insight with ID: ${insightId}`,
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "delete-funnel",
	description: `
        - Delete a funnel insight from PostHog.
        - Permanently removes the funnel and its configuration.
        - Cannot be undone - use with caution.
        - Returns confirmation of deletion.
    `,
	schema,
	handler: deleteFunnelHandler,
});

export default tool; 