import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { MemberGetSchema } from "@/schema/tool-inputs";

const schema = MemberGetSchema;

type Params = z.infer<typeof schema>;

export const getMemberHandler = async (context: Context, params: Params) => {
	const { organizationId, userUuid } = params;

	const projectId = await context.getProjectId();
	const baseUrl = getProjectBaseUrl(projectId);
	const url = `${baseUrl}/organizations/${organizationId}/members/${userUuid}/`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get member: ${response.status} ${errorText}`);
	}

	const member = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(member, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-member",
	description: `
        - Get a specific member by organization ID and user UUID.
        - Returns detailed information about the member.
    `,
	schema,
	handler: getMemberHandler,
});

export default tool; 