import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { MemberGetAllSchema } from "@/schema/tool-inputs";

const schema = MemberGetAllSchema;

type Params = z.infer<typeof schema>;

export const getAllMembersHandler = async (context: Context, params: Params) => {
	const { data } = params;
	const { organizationId } = data;

	const queryParams = new URLSearchParams();
	if (data?.limit) queryParams.append("limit", data.limit.toString());
	if (data?.offset) queryParams.append("offset", data.offset.toString());

	const url = `${getProjectBaseUrl(context as any)}/organizations/${organizationId}/members/?${queryParams.toString()}`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get members: ${response.status} ${errorText}`);
	}

	const members = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(members, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-all-members",
	description: `
        - List all members in the organization.
        - Supports pagination with limit/offset.
        - Returns paginated results with next/previous links.
    `,
	schema,
	handler: getAllMembersHandler,
});

export default tool; 