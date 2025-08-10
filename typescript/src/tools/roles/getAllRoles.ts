import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { RoleGetAllSchema } from "@/schema/tool-inputs";

const schema = RoleGetAllSchema;

type Params = z.infer<typeof schema>;

export const getAllRolesHandler = async (context: Context, params: Params) => {
	const { data } = params;
	const { organizationId } = data;

	const queryParams = new URLSearchParams();
	if (data?.limit) queryParams.append("limit", data.limit.toString());
	if (data?.offset) queryParams.append("offset", data.offset.toString());

	const projectId = await context.getProjectId();
	const baseUrl = getProjectBaseUrl(projectId);
	const url = `${baseUrl}/organizations/${organizationId}/roles/?${queryParams.toString()}`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get roles: ${response.status} ${errorText}`);
	}

	const roles = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(roles, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-all-roles",
	description: `
        - List all roles in the organization.
        - Supports pagination with limit/offset.
        - Returns paginated results with next/previous links.
    `,
	schema,
	handler: getAllRolesHandler,
});

export default tool; 