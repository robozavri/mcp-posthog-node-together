import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { ActionUpdateSchema } from "@/schema/tool-inputs";

const schema = ActionUpdateSchema;

type Params = z.infer<typeof schema>;

export const updateHandler = async (context: Context, params: Params) => {
	const { actionId, data } = params;
	const projectId = await context.getProjectId();

	const payload: any = {};
	if (data.name !== undefined) payload.name = data.name;
	if (data.description !== undefined) payload.description = data.description;
	if (data.post_to_slack !== undefined) payload.post_to_slack = data.post_to_slack;
	if (data.slack_message_format !== undefined) payload.slack_message_format = data.slack_message_format;
	if (data.steps !== undefined) payload.steps = data.steps;
	if (data.deleted !== undefined) payload.deleted = data.deleted;
	if (data.is_calculating !== undefined) payload.is_calculating = data.is_calculating;

	const url = `${getProjectBaseUrl(projectId)}/actions/${actionId}/`;
	const response = await fetch(url, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to update action: ${response.status} ${errorText}`);
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
	name: "update-action",
	description: `
        - Update an action's properties by ID.
        - Supports updating name, description, steps, and Slack settings.
        - Returns the updated action details.
    `,
	schema,
	handler: updateHandler,
});

export default tool; 