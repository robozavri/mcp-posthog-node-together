import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { CohortGetPersonsSchema } from "@/schema/tool-inputs";

const schema = CohortGetPersonsSchema;

type Params = z.infer<typeof schema>;

export const getPersonsHandler = async (context: Context, params: Params) => {
	const { cohortId, limit, offset } = params;
	const projectId = await context.getProjectId();

	const queryParams = new URLSearchParams();
	if (limit) queryParams.append("limit", limit.toString());
	if (offset) queryParams.append("offset", offset.toString());

	const url = `${getProjectBaseUrl(projectId)}/cohorts/${cohortId}/persons/?${queryParams.toString()}`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get cohort persons: ${response.status} ${errorText}`);
	}

	const persons = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(persons, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-cohort-persons",
	description: `
        - Get all persons (users) in a specific cohort.
        - Supports pagination with limit/offset.
        - Returns the list of persons in the cohort.
    `,
	schema,
	handler: getPersonsHandler,
});

export default tool; 