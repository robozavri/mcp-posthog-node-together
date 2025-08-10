import { ApiResponseSchema } from "../../schema/api";
import type { z } from "zod";

export const withPagination = async <T>(
	url: string,
	apiToken: string,
	dataSchema: z.ZodType<T>,
): Promise<T[]> => {
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${apiToken}`,
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
	}

	const data = await response.json();

	const responseSchema = ApiResponseSchema<z.ZodType<T>>(dataSchema);

	const parsedData = responseSchema.parse(data);

	const results = parsedData.results.map((result: T) => result);

	if (parsedData.next) {
		const nextResults: T[] = await withPagination<T>(parsedData.next, apiToken, dataSchema);
		return [...results, ...nextResults];
	}

	return results;
};

export const getProjectBaseUrl = (projectId: string | number) => {
	// if (projectId === "@current") {
	// 	return "https://analytics.vps.webdock.cloud";
	// 	// return "https://us.posthog.com"; 
	// }
	// @current  also works
	return ` https://analytics.vps.webdock.cloud/api/projects/${projectId}`;
	// return `https://us.posthog.com/project/${projectId}`;
};