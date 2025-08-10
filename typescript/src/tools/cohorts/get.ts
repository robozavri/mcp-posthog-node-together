import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { CohortGetSchema } from "@/schema/tool-inputs";

const schema = CohortGetSchema;

type Params = z.infer<typeof schema>;

export const getHandler = async (context: Context, params: Params) => {
	const { cohortId } = params;
	const projectId = await context.getProjectId();

	const url = `${getProjectBaseUrl(projectId)}/cohorts/${cohortId}/`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get cohort: ${response.status} ${errorText}`);
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
	name: "get-cohort",
	description: `
        - Get a specific cohort by ID.
        - Returns detailed information about the cohort including filters and members.
    `,
	schema,
	handler: getHandler,
});

export default tool; 