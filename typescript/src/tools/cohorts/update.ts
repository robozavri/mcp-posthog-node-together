import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { CohortUpdateSchema } from "@/schema/tool-inputs";

const schema = CohortUpdateSchema;

type Params = z.infer<typeof schema>;

export const updateHandler = async (context: Context, params: Params) => {
	const { cohortId, data } = params;
	const projectId = await context.getProjectId();

	const payload: any = {};
	if (data.name !== undefined) payload.name = data.name;
	if (data.groups !== undefined) payload.groups = data.groups;
	if (data.description !== undefined) payload.description = data.description;
	if (data.isStatic !== undefined) payload.is_static = data.isStatic;
	if (data.tags !== undefined) payload.tags = data.tags;

	const url = `${getProjectBaseUrl(projectId)}/cohorts/${cohortId}/`;
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
		throw new Error(`Failed to update cohort: ${response.status} ${errorText}`);
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
	name: "update-cohort",
	description: `
        - Update a cohort's properties by ID.
        - Supports updating name, filters, description, and tags.
        - Returns the updated cohort details.
    `,
	schema,
	handler: updateHandler,
});

export default tool; 