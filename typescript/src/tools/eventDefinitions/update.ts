import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { EventDefinitionUpdateSchema } from "@/schema/tool-inputs";

const schema = EventDefinitionUpdateSchema;

type Params = z.infer<typeof schema>;

export const updateHandler = async (context: Context, params: Params) => {
	const { eventName, data } = params;
	const projectId = await context.getProjectId();

	const payload: any = {};
	if (data.description !== undefined) payload.description = data.description;
	if (data.verified !== undefined) payload.verified = data.verified;
	if (data.owner !== undefined) payload.owner = data.owner;

	const url = `${getProjectBaseUrl(projectId)}/event_definitions/${eventName}/`;
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
		throw new Error(`Failed to update event definition: ${response.status} ${errorText}`);
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
	name: "update-event-definition",
	description: `
        - Update an event definition's properties by name.
        - Supports updating description, verification status, and owner.
        - Returns the updated event definition details.
    `,
	schema,
	handler: updateHandler,
});

export default tool; 