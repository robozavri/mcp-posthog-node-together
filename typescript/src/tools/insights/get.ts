import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { InsightGetSchema } from "@/schema/tool-inputs";

const schema = InsightGetSchema;

type Params = z.infer<typeof schema>;

export const getHandler = async (context: Context, params: Params) => {
	const { insightId } = params;
	const projectId = await context.getProjectId();

	const url = `${getProjectBaseUrl(projectId)}/insights/${insightId}/`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get insight: ${response.status} ${errorText}`);
	}

	const insight = await response.json();

	const insightWithUrl = {
		...insight,
		url: `${getProjectBaseUrl(projectId)}/insights/${insight.short_id}`,
	};

	return { 
		content: [{ 
			type: "text", 
			text: JSON.stringify(insightWithUrl, null, 2) 
		}] 
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "insight-get",
	description: `
        - Get a specific insight by ID.
        - Returns insight details with URL for easy access.
    `,
	schema,
	handler: getHandler,
});

export default tool;
