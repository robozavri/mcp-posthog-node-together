import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { CohortDuplicateSchema } from "@/schema/tool-inputs";

const schema = CohortDuplicateSchema;

type Params = z.infer<typeof schema>;

export const duplicateHandler = async (context: Context, params: Params) => {
	const { cohortId, name, description } = params;
	const projectId = await context.getProjectId();

	const payload = {
		name,
		description,
	};

	const url = `${getProjectBaseUrl(projectId)}/cohorts/${cohortId}/duplicate/`;
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
		throw new Error(`Failed to duplicate cohort: ${response.status} ${errorText}`);
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
	name: "duplicate-cohort",
	description: `
        - Duplicate an existing cohort with a new name.
        - Creates a copy of the cohort with all its filters and properties.
        - Returns the new cohort details.
    `,
	schema,
	handler: duplicateHandler,
});

export default tool; 