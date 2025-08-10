import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { MemberUpdateSchema } from "@/schema/tool-inputs";

const schema = MemberUpdateSchema;

type Params = z.infer<typeof schema>;

export const updateMemberHandler = async (context: Context, params: Params) => {
	const { organizationId, userUuid, data } = params;

	const payload: any = {};
	if (data.level !== undefined) payload.level = data.level;
	if (data.first_name !== undefined) payload.first_name = data.first_name;
	if (data.last_name !== undefined) payload.last_name = data.last_name;

	const url = `${getProjectBaseUrl(context as any)}/organizations/${organizationId}/members/${userUuid}/`;
	const response = await fetch(url, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to update member: ${response.status} ${errorText}`);
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
	name: "update-member",
	description: `
        - Update a member's properties by organization ID and user UUID.
        - Supports updating access level and member details.
        - Returns the updated member details.
    `,
	schema,
	handler: updateMemberHandler,
});

export default tool; 