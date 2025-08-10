import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { PersonCreateSchema } from "@/schema/tool-inputs";

const schema = PersonCreateSchema;

type Params = z.infer<typeof schema>;

export const createHandler = async (context: Context, params: Params) => {
	const { data } = params;
	const projectId = await context.getProjectId();

	const payload = {
		distinct_id: data.distinctId,
		...data.properties,
		...data.$set,
		...data.$set_once,
	};

	const url = `${getProjectBaseUrl(projectId)}/persons/`;
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
		throw new Error(`Failed to create person: ${response.status} ${errorText}`);
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
	name: "create-person",
	description: `
        - Create a new person with the specified distinct_id and properties.
        - Supports setting properties with $set and $set_once operations.
        - Returns the created person details.
    `,
	schema,
	handler: createHandler,
});

export default tool; 