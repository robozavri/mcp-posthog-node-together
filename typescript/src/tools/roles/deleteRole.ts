import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { RoleDeleteSchema } from "@/schema/tool-inputs";

const schema = RoleDeleteSchema;

type Params = z.infer<typeof schema>;

export const deleteRoleHandler = async (context: Context, params: Params) => {
	const { organizationId, roleId } = params;

	const projectId = await context.getProjectId();
	const baseUrl = getProjectBaseUrl(projectId);
	const url = `${baseUrl}/organizations/${organizationId}/roles/${roleId}/`;
	const response = await fetch(url, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to delete role: ${response.status} ${errorText}`);
	}

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify({ success: true, message: "Role deleted successfully" }, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "delete-role",
	description: `
        - Delete a role by organization ID and role ID.
        - This action cannot be undone.
        - Returns success confirmation.
    `,
	schema,
	handler: deleteRoleHandler,
});

export default tool; 