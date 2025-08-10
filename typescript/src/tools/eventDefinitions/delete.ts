import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { EventDefinitionDeleteSchema } from "@/schema/tool-inputs";

const schema = EventDefinitionDeleteSchema;

type Params = z.infer<typeof schema>;

export const deleteHandler = async (context: Context, params: Params) => {
	const { eventName } = params;
	const projectId = await context.getProjectId();

	const url = `${getProjectBaseUrl(projectId)}/event_definitions/${eventName}/`;
	const response = await fetch(url, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to delete event definition: ${response.status} ${errorText}`);
	}

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify({ success: true, message: "Event definition deleted successfully" }, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "delete-event-definition",
	description: `
        - Delete an event definition by name.
        - This action cannot be undone.
        - Returns success confirmation.
    `,
	schema,
	handler: deleteHandler,
});

export default tool; 