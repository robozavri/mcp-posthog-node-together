import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { EventDefinitionGetSchema } from "@/schema/tool-inputs";

const schema = EventDefinitionGetSchema;

type Params = z.infer<typeof schema>;

export const getHandler = async (context: Context, params: Params) => {
	const { eventName } = params;
	const projectId = await context.getProjectId();

	const url = `${getProjectBaseUrl(projectId)}/event_definitions/${eventName}/`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get event definition: ${response.status} ${errorText}`);
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
	name: "get-event-definition",
	description: `
        - Get a specific event definition by name.
        - Returns detailed information about the event including usage and metadata.
    `,
	schema,
	handler: getHandler,
});

export default tool; 