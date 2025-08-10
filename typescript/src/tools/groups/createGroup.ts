import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { GroupCreateSchema } from "@/schema/tool-inputs";

const schema = GroupCreateSchema;

type Params = z.infer<typeof schema>;

export const createGroupHandler = async (context: Context, params: Params) => {
	const { data } = params;
	const projectId = await context.getProjectId();

	const payload = {
		group_type_index: data.groupTypeIndex,
		group_key: data.group_key,
		group_properties: data.group_properties,
		created_at: data.created_at,
		updated_at: data.updated_at,
	};

	const url = `${getProjectBaseUrl(projectId)}/api/projects/${projectId}/groups/`;
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
		throw new Error(`Failed to create group: ${response.status} ${errorText}`);
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
	name: "create-group",
	description: `
        - Create a new group for a specific group type.
        - Supports custom group properties and timestamps.
        - Returns the created group details.
    `,
	schema,
	handler: createGroupHandler,
});

export default tool; 