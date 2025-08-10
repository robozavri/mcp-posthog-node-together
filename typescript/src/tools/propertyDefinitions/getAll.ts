import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { PropertyDefinitionGetAllSchema } from "@/schema/tool-inputs";

const schema = PropertyDefinitionGetAllSchema;

type Params = z.infer<typeof schema>;

export const getAllHandler = async (context: Context, params: Params) => {
	const projectId = await context.getProjectId();
	const { data } = params;

	const queryParams = new URLSearchParams();
	if (data?.limit) queryParams.append("limit", data.limit.toString());
	if (data?.offset) queryParams.append("offset", data.offset.toString());
	if (data?.search) queryParams.append("search", data.search);
	if (data?.property_type) queryParams.append("property_type", data.property_type);
	if (data?.group_type_index) queryParams.append("group_type_index", data.group_type_index.toString());

	const url = `${getProjectBaseUrl(projectId)}/property_definitions/?${queryParams.toString()}`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get property definitions: ${response.status} ${errorText}`);
	}

	const propertyDefinitions = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(propertyDefinitions, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-all-property-definitions",
	description: `
        - List all property definitions in the project.
        - Supports pagination and filtering by type, search, and group type.
        - Returns paginated results with next/previous links.
    `,
	schema,
	handler: getAllHandler,
});

export default tool; 