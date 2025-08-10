import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { MemberRemoveSchema } from "@/schema/tool-inputs";

const schema = MemberRemoveSchema;

type Params = z.infer<typeof schema>;

export const removeMemberHandler = async (context: Context, params: Params) => {
	const { organizationId, userUuid } = params;

	const projectId = await context.getProjectId();
	const baseUrl = await getProjectBaseUrl(projectId);
	const resolvedBaseUrl = await baseUrl;
	const url = `${resolvedBaseUrl}/organizations/${organizationId}/members/${userUuid}/`;
	const response = await fetch(url, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to remove member: ${response.status} ${errorText}`);
	}

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify({ success: true, message: "Member removed successfully" }, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "remove-member",
	description: `
        - Remove a member from the organization by organization ID and user UUID.
        - This action cannot be undone.
        - Returns success confirmation.
    `,
	schema,
	handler: removeMemberHandler,
});

export default tool; 