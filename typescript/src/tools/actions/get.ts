import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { ActionGetSchema } from "@/schema/tool-inputs";

const schema = ActionGetSchema;

type Params = z.infer<typeof schema>;

export const getHandler = async (context: Context, params: Params) => {
	const { actionId } = params;
	const projectId = await context.getProjectId();

	const url = `${getProjectBaseUrl(projectId)}/actions/${actionId}/`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get action: ${response.status} ${errorText}`);
	}

	const action = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(action, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-action",
	description: `
        - Get a specific action by ID.
        - Returns detailed information about the action including steps and triggers.
    `,
	schema,
	handler: getHandler,
});

export default tool; 