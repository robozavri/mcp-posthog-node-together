import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { PropertyDefinitionCreateSchema } from "@/schema/tool-inputs";

const schema = PropertyDefinitionCreateSchema;

type Params = z.infer<typeof schema>;

export const createHandler = async (context: Context, params: Params) => {
	const { data } = params;
	const projectId = await context.getProjectId();

	const payload = {
		name: data.name,
		property_type: data.property_type,
		description: data.description,
		group_type_index: data.group_type_index,
		property_type_format: data.property_type_format,
		example: data.example,
		property_type_definition: data.property_type_definition,
		is_numerical: data.is_numerical,
		is_seen_on_filtered_events: data.is_seen_on_filtered_events,
		query_usage_30_day: data.query_usage_30_day,
		volume_30_day: data.volume_30_day,
	};

	const url = `${getProjectBaseUrl(projectId)}/property_definitions/`;
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
		throw new Error(`Failed to create property definition: ${response.status} ${errorText}`);
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
	name: "create-property-definition",
	description: `
        - Create a new property definition.
        - Supports event, person, and group property types.
        - Returns the created property definition details.
    `,
	schema,
	handler: createHandler,
});

export default tool; 