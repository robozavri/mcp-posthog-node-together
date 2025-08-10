import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { EnvironmentDeleteSchema } from "@/schema/tool-inputs";

const schema = EnvironmentDeleteSchema;

type Params = z.infer<typeof schema>;

export const deleteEnvironmentHandler = async (context: Context, params: Params) => {
	const { projectId, environmentId } = params;

	const url = `${getProjectBaseUrl(String(projectId))}/environments/${String(environmentId)}/`;
	const response = await fetch(url, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to delete environment: ${response.status} ${errorText}`);
	}

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify({ success: true, message: "Environment deleted successfully" }, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "delete-environment",
	description: `
        - Delete an environment from the project.
        - Permanently removes the environment and all associated data.
        - Returns success confirmation.
    `,
	schema,
	handler: deleteEnvironmentHandler,
});

export default tool; 