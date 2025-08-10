import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { EventDefinitionCreateSchema } from "@/schema/tool-inputs";

const schema = EventDefinitionCreateSchema;

type Params = z.infer<typeof schema>;

export const createHandler = async (context: Context, params: Params) => {
	const { data } = params;
	const projectId = await context.getProjectId();

	const payload = {
		name: data.name,
		description: data.description,
		query_usage_30_day: data.query_usage_30_day,
		volume_30_day: data.volume_30_day,
		verified: data.verified,
		owner: data.owner,
		created_at: data.created_at,
		updated_at: data.updated_at,
		last_seen_at: data.last_seen_at,
		last_updated_at: data.last_updated_at,
	};

	const url = `${getProjectBaseUrl(projectId)}/event_definitions/`;
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
		throw new Error(`Failed to create event definition: ${response.status} ${errorText}`);
	}

	const eventDefinition = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(eventDefinition, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "create-event-definition",
	description: `
        - Create a new event definition.
        - Supports custom event metadata and usage tracking.
        - Returns the created event definition details.
    `,
	schema,
	handler: createHandler,
});

export default tool; 