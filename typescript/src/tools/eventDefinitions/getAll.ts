import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { EventDefinitionGetAllSchema } from "@/schema/tool-inputs";

const schema = EventDefinitionGetAllSchema;

type Params = z.infer<typeof schema>;

export const getAllHandler = async (context: Context, params: Params) => {
	const projectId = await context.getProjectId();
	const { data } = params;

	const queryParams = new URLSearchParams();
	if (data?.limit) queryParams.append("limit", data.limit.toString());
	if (data?.offset) queryParams.append("offset", data.offset.toString());
	if (data?.search) queryParams.append("search", data.search);
	if (data?.event_type) queryParams.append("event_type", data.event_type);

	const url = `${getProjectBaseUrl(projectId)}/event_definitions/?${queryParams.toString()}`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get event definitions: ${response.status} ${errorText}`);
	}

	const eventDefinitions = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(eventDefinitions, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-all-event-definitions",
	description: `
        - List all event definitions in the project.
        - Supports pagination and filtering by type and search.
        - Returns paginated results with next/previous links.
    `,
	schema,
	handler: getAllHandler,
});

export default tool; 