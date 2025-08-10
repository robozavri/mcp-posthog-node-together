import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { PropertyDefinitionUpdateSchema } from "@/schema/tool-inputs";

const schema = PropertyDefinitionUpdateSchema;

type Params = z.infer<typeof schema>;

export const updateHandler = async (context: Context, params: Params) => {
	const { propertyKey, data } = params;
	const projectId = await context.getProjectId();

	const payload: any = {};
	if (data.name !== undefined) payload.name = data.name;
	if (data.description !== undefined) payload.description = data.description;
	if (data.property_type_format !== undefined) payload.property_type_format = data.property_type_format;
	if (data.example !== undefined) payload.example = data.example;
	if (data.property_type_definition !== undefined) payload.property_type_definition = data.property_type_definition;
	if (data.is_numerical !== undefined) payload.is_numerical = data.is_numerical;
	if (data.is_seen_on_filtered_events !== undefined) payload.is_seen_on_filtered_events = data.is_seen_on_filtered_events;

	const url = `${getProjectBaseUrl(projectId)}/property_definitions/${propertyKey}/`;
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
		throw new Error(`Failed to update property definition: ${response.status} ${errorText}`);
	}

	const propertyDefinition = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(propertyDefinition, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "update-property-definition",
	description: `
        - Update a property definition's properties by key.
        - Supports updating name, description, format, and metadata.
        - Returns the updated property definition details.
    `,
	schema,
	handler: updateHandler,
});

export default tool; 