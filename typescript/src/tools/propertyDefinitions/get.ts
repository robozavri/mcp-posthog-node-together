import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { PropertyDefinitionGetSchema } from "@/schema/tool-inputs";

const schema = PropertyDefinitionGetSchema;

type Params = z.infer<typeof schema>;

export const getHandler = async (context: Context, params: Params) => {
	const { propertyKey } = params;
	const projectId = await context.getProjectId();

	const url = `${getProjectBaseUrl(projectId)}/property_definitions/${propertyKey}/`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get property definition: ${response.status} ${errorText}`);
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
	name: "get-property-definition",
	description: `
        - Get a specific property definition by key.
        - Returns detailed information about the property including type and usage.
    `,
	schema,
	handler: getHandler,
});

export default tool; 