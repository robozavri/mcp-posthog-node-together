import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { GroupGetSchema } from "@/schema/tool-inputs";

const schema = GroupGetSchema;

type Params = z.infer<typeof schema>;

export const getGroupHandler = async (context: Context, params: Params) => {
	const { groupTypeIndex, groupKey } = params;
	const projectId = await context.getProjectId();

	const queryParams = new URLSearchParams();
	queryParams.append("group_key", groupKey);
	queryParams.append("group_type_index", groupTypeIndex.toString());

	const url = `${getProjectBaseUrl(projectId)}/api/projects/${projectId}/groups/find/?${queryParams.toString()}`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get group: ${response.status} ${errorText}`);
	}

	const group = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(group, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-group",
	description: `
        - Get a specific group by type index and key.
        - Returns detailed information about the group including properties.
    `,
	schema,
	handler: getGroupHandler,
});

export default tool; 