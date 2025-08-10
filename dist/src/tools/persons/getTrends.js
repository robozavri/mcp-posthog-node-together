"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrendsHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.PersonGetTrendsSchema;
const getTrendsHandler = async (context, params) => {
    const { dateFrom, interval, filters } = params;
    const projectId = await context.getProjectId();
    const queryParams = new URLSearchParams();
    if (dateFrom)
        queryParams.append("date_from", dateFrom);
    if (interval)
        queryParams.append("interval", interval);
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            queryParams.append(`filters[${key}]`, JSON.stringify(value));
        });
    }
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/persons/trends/?${queryParams.toString()}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get person trends: ${response.status} ${errorText}`);
    }
    const trends = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(trends, null, 2),
            },
        ],
    };
};
exports.getTrendsHandler = getTrendsHandler;
const tool = () => ({
    name: "get-person-trends",
    description: `
        - Get per-user trend summaries (counts, activity).
        - Shows user engagement trends over time.
        - Supports filtering by date range and additional filters.
    `,
    schema,
    handler: exports.getTrendsHandler,
});
exports.default = tool;
