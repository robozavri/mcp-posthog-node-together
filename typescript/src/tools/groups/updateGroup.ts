import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { GroupUpdateSchema } from "@/schema/tool-inputs";

const schema = GroupUpdateSchema;

type Params = z.infer<typeof schema>;

export const updateGroupHandler = async (context: Context, params: Params) => {
	const { groupTypeIndex, groupKey, data } = params;
	const projectId = await context.getProjectId();

	const payload: any = {
		group_type_index: groupTypeIndex,
		group_key: groupKey,
	};
	if (data.group_properties !== undefined) payload.group_properties = data.group_properties;

	const queryParams = new URLSearchParams();
	queryParams.append("group_key", groupKey);
	queryParams.append("group_type_index", groupTypeIndex.toString());

	const url = `${getProjectBaseUrl(projectId)}/api/projects/${projectId}/groups/update_property/?${queryParams.toString()}`;
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
		throw new Error(`Failed to update group: ${response.status} ${errorText}`);
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
	name: "update-group",
	description: `
        - Update a group's properties by type index and key.
        - Supports updating group properties.
        - Returns the updated group details.
    `,
	schema,
	handler: updateGroupHandler,
});

export default tool; 