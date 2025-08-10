import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { CohortCreateSchema } from "@/schema/tool-inputs";

const schema = CohortCreateSchema;

type Params = z.infer<typeof schema>;

export const createHandler = async (context: Context, params: Params) => {
	const { data } = params;
	const projectId = await context.getProjectId();

	const payload = {
		name: data.name,
		groups: data.groups,
		description: data.description,
		is_static: data.isStatic,
		tags: data.tags,
	};

	const url = `${getProjectBaseUrl(projectId)}/cohorts/`;
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
		throw new Error(`Failed to create cohort: ${response.status} ${errorText}`);
	}

	const cohort = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(cohort, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "create-cohort",
	description: `
        - Create a new cohort with the specified name, filters, and properties.
        - Supports static and dynamic cohorts.
        - Returns the created cohort details.
    `,
	schema,
	handler: createHandler,
});

export default tool; 