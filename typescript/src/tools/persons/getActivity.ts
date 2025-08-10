import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { PersonGetActivitySchema } from "@/schema/tool-inputs";

const schema = PersonGetActivitySchema;

type Params = z.infer<typeof schema>;

export const getActivityHandler = async (context: Context, params: Params) => {
	const { personId, limit, before, after } = params;
	const projectId = await context.getProjectId();

	const queryParams = new URLSearchParams();
	if (limit) queryParams.append("limit", limit.toString());
	if (before) queryParams.append("before", before);
	if (after) queryParams.append("after", after);

	const url = `${getProjectBaseUrl(projectId)}/persons/${encodeURIComponent(personId)}/activity/?${queryParams.toString()}`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get person activity: ${response.status} ${errorText}`);
	}

	const activity = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(activity, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-person-activity",
	description: `
        - Get a person's recent activity timeline.
        - Returns events and actions performed by the person.
        - Supports pagination with before/after timestamps.
    `,
	schema,
	handler: getActivityHandler,
});

export default tool; 