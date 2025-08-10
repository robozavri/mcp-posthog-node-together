"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.InsightGetAllSchema;
const getAllHandler = async (context, params) => {
    const projectId = await context.getProjectId();
    const { data } = params;
    const queryParams = new URLSearchParams();
    if (data?.limit)
        queryParams.append("limit", data.limit.toString());
    if (data?.offset)
        queryParams.append("offset", data.offset.toString());
    if (data?.saved)
        queryParams.append("saved", data.saved.toString());
    if (data?.favorited)
        queryParams.append("favorited", data.favorited.toString());
    if (data?.search)
        queryParams.append("search", data.search);
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/insights/?${queryParams.toString()}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get insights: ${response.status} ${errorText}`);
    }
    const insights = await response.json();
    // Add URLs to insights for easier access
    const insightsWithUrls = insights.results?.map((insight) => ({
        ...insight,
        url: `${(0, api_1.getProjectBaseUrl)(projectId)}/insights/${insight.short_id}`,
    })) || insights;
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(insightsWithUrls, null, 2),
            },
        ],
    };
};
exports.getAllHandler = getAllHandler;
const tool = () => ({
    name: "insights-get-all",
    description: `
        - Get all insights in the project with optional filtering.
        - Can filter by saved status, favorited status, or search term.
        - Supports pagination with limit/offset.
        - Returns insights with their URLs for easy access.
    `,
    schema,
    handler: exports.getAllHandler,
});
exports.default = tool;
