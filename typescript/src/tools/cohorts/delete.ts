import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { CohortDeleteSchema } from "@/schema/tool-inputs";

const schema = CohortDeleteSchema;

type Params = z.infer<typeof schema>;

export const deleteHandler = async (context: Context, params: Params) => {
	const { cohortId } = params;
	const projectId = await context.getProjectId();

	const url = `${getProjectBaseUrl(projectId)}/cohorts/${cohortId}/`;
	const response = await fetch(url, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to delete cohort: ${response.status} ${errorText}`);
	}

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify({ success: true, message: "Cohort deleted successfully" }, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "delete-cohort",
	description: `
        - Delete a cohort by ID.
        - This action cannot be undone.
        - Returns success confirmation.
    `,
	schema,
	handler: deleteHandler,
});

export default tool; 