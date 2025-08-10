import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { HogFunctionDeleteSchema } from "@/schema/tool-inputs";

const schema = HogFunctionDeleteSchema;

type Params = z.infer<typeof schema>;

export const deleteHogFunctionHandler = async (context: Context, params: Params) => {
	const { projectId, functionId } = params;

	const url = `${getProjectBaseUrl(String(projectId))}/hog_functions/${String(functionId)}/`;
	const response = await fetch(url, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to delete hog function: ${response.status} ${errorText}`);
	}

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify({ success: true, message: "Hog function deleted successfully" }, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "delete-hog-function",
	description: `
        - Delete a hog function from the project.
        - Permanently removes the hog function and all associated data.
        - Returns success confirmation.
    `,
	schema,
	handler: deleteHogFunctionHandler,
});

export default tool; 