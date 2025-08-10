import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { GroupTypeGetSchema } from "@/schema/tool-inputs";

const schema = GroupTypeGetSchema;

type Params = z.infer<typeof schema>;

export const getGroupTypeHandler = async (context: Context, params: Params) => {
	const { groupTypeIndex } = params;
	const projectId = await context.getProjectId();

	const url = `${getProjectBaseUrl(projectId)}/api/projects/${projectId}/groups_types/${groupTypeIndex}/`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get group type: ${response.status} ${errorText}`);
	}

	const groupType = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(groupType, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-group-type",
	description: `
        - Get a specific group type by index.
        - Returns detailed information about the group type.
    `,
	schema,
	handler: getGroupTypeHandler,
});

export default tool; 