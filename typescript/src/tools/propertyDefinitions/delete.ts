import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { PropertyDefinitionDeleteSchema } from "@/schema/tool-inputs";

const schema = PropertyDefinitionDeleteSchema;

type Params = z.infer<typeof schema>;

export const deleteHandler = async (context: Context, params: Params) => {
	const { propertyKey } = params;
	const projectId = await context.getProjectId();

	const url = `${getProjectBaseUrl(projectId)}/property_definitions/${propertyKey}/`;
	const response = await fetch(url, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to delete property definition: ${response.status} ${errorText}`);
	}

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify({ success: true, message: "Property definition deleted successfully" }, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "delete-property-definition",
	description: `
        - Delete a property definition by key.
        - This action cannot be undone.
        - Returns success confirmation.
    `,
	schema,
	handler: deleteHandler,
});

export default tool; 