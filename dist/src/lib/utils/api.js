"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectBaseUrl = exports.withPagination = void 0;
const api_1 = require("../../schema/api");
const withPagination = async (url, apiToken, dataSchema) => {
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${apiToken}`,
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const data = await response.json();
    const responseSchema = (0, api_1.ApiResponseSchema)(dataSchema);
    const parsedData = responseSchema.parse(data);
    const results = parsedData.results.map((result) => result);
    if (parsedData.next) {
        const nextResults = await (0, exports.withPagination)(parsedData.next, apiToken, dataSchema);
        return [...results, ...nextResults];
    }
    return results;
};
exports.withPagination = withPagination;
const getProjectBaseUrl = (projectId) => {
    // if (projectId === "@current") {
    // 	return "https://analytics.vps.webdock.cloud";
    // 	// return "https://us.posthog.com"; 
    // }
    // @current  also works
    return ` https://analytics.vps.webdock.cloud/api/projects/${projectId}`;
    // return `https://us.posthog.com/project/${projectId}`;
};
exports.getProjectBaseUrl = getProjectBaseUrl;
