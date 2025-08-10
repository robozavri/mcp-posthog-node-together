import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { GroupGetAllSchema } from "@/schema/tool-inputs";

const schema = GroupGetAllSchema;

type Params = z.infer<typeof schema>;

export const getAllGroupsHandler = async (context: Context, params: Params) => {
	const projectId = await context.getProjectId();
	const { data } = params;

	const queryParams = new URLSearchParams();
	if (data?.limit) queryParams.append("limit", data.limit.toString());
	if (data?.offset) queryParams.append("offset", data.offset.toString());
	if (data?.search) queryParams.append("search", data.search);
	if (data?.group_key) queryParams.append("group_key", data.group_key);

	// Use default groupTypeIndex of 0 if not provided
	const groupTypeIndex = data?.groupTypeIndex ?? 0;
	// Add group_type_index as query parameter according to PostHog API docs
	queryParams.append("group_type_index", groupTypeIndex.toString());
	
	const url = `${getProjectBaseUrl(projectId)}/api/projects/${projectId}/groups/?${queryParams.toString()}`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get groups: ${response.status} ${errorText}`);
	}

	const groups = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(groups, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-all-groups",
	description: `
        - List all groups for a specific group type.
        - groupTypeIndex is optional and defaults to 0 (first group type).
        - Supports pagination and filtering by search and group key.
        - Returns paginated results with next/previous links.
        - Use get-all-group-types first to see available group types.
    `,
	schema,
	handler: getAllGroupsHandler,
});

export default tool; 