import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { ActionCreateSchema } from "@/schema/tool-inputs";

const schema = ActionCreateSchema;

type Params = z.infer<typeof schema>;

export const createHandler = async (context: Context, params: Params) => {
	const { data } = params;
	const projectId = await context.getProjectId();

	const payload = {
		name: data.name,
		description: data.description,
		post_to_slack: data.post_to_slack,
		slack_message_format: data.slack_message_format,
		steps: data.steps,
		deleted: data.deleted,
		is_calculating: data.is_calculating,
		created_by: data.created_by,
		created_at: data.created_at,
		updated_at: data.updated_at,
	};

	const url = `${getProjectBaseUrl(projectId)}/actions/`;
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
		throw new Error(`Failed to create action: ${response.status} ${errorText}`);
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
	name: "create-action",
	description: `
        - Create a new action with steps and triggers.
        - Supports Slack integration and custom message formats.
        - Returns the created action details.
    `,
	schema,
	handler: createHandler,
});

export default tool; 