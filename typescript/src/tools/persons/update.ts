import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { PersonUpdateSchema } from "@/schema/tool-inputs";

const schema = PersonUpdateSchema;

type Params = z.infer<typeof schema>;

export const updateHandler = async (context: Context, params: Params) => {
	const { personId, data } = params;
	const projectId = await context.getProjectId();

	const payload = {
		...data.properties,
		...data.$set,
		...data.$set_once,
	};

	const url = `${getProjectBaseUrl(projectId)}/persons/${encodeURIComponent(personId)}/`;
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
		throw new Error(`Failed to update person: ${response.status} ${errorText}`);
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
	name: "update-person",
	description: `
        - Update a person's properties by their distinct_id.
        - Supports setting properties with $set and $set_once operations.
        - Returns the updated person details.
    `,
	schema,
	handler: updateHandler,
});

export default tool; 