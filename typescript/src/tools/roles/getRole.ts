import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { RoleGetSchema } from "@/schema/tool-inputs";

const schema = RoleGetSchema;

type Params = z.infer<typeof schema>;

export const getRoleHandler = async (context: Context, params: Params) => {
	const { organizationId, roleId } = params;

	const projectId = await context.getProjectId();
	const baseUrl = getProjectBaseUrl(projectId);
	const url = `${baseUrl}/organizations/${organizationId}/roles/${roleId}/`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get role: ${response.status} ${errorText}`);
	}

	const role = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(role, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-role",
	description: `
        - Get a specific role by organization ID and role ID.
        - Returns detailed information about the role including permissions.
    `,
	schema,
	handler: getRoleHandler,
});

export default tool; 