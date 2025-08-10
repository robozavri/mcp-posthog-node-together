import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { PersonGetSchema } from "@/schema/tool-inputs";

const schema = PersonGetSchema;

type Params = z.infer<typeof schema>;

export const getHandler = async (context: Context, params: Params) => {
	const { personId, format } = params;
	const projectId = await context.getProjectId();

	const queryParams = new URLSearchParams();
	if (format) queryParams.append("format", format);

	const url = `${getProjectBaseUrl(projectId)}/persons/${encodeURIComponent(personId)}/?${queryParams.toString()}`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get person: ${response.status} ${errorText}`);
	}

	const person = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(person, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-person",
	description: `
        - Get a specific person by their distinct_id.
        - Returns detailed information about the person including properties and events.
    `,
	schema,
	handler: getHandler,
});

export default tool; 