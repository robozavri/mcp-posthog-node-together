import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { MemberInviteSchema } from "@/schema/tool-inputs";

const schema = MemberInviteSchema;

type Params = z.infer<typeof schema>;

export const inviteMemberHandler = async (context: Context, params: Params) => {
	const { data } = params;
	const projectId = await context.getProjectId();

	const payload = {
		email: data.email,
		level: data.level,
		first_name: data.first_name,
		last_name: data.last_name,
	};

	const url = `${getProjectBaseUrl(projectId)}/organizations/${data.organizationId}/members/`;
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
		throw new Error(`Failed to invite member: ${response.status} ${errorText}`);
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
	name: "invite-member",
	description: `
        - Invite a new member to the organization.
        - Supports setting access level and member details.
        - Returns the invited member details.
    `,
	schema,
	handler: inviteMemberHandler,
});

export default tool; 