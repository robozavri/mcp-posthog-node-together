"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebAnalyticsHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.WebAnalyticsGetSchema;
const getWebAnalyticsHandler = async (context, params) => {
    const projectId = await context.getProjectId();
    const { ...filters } = params;
    const queryParams = new URLSearchParams();
    if (filters.date_from)
        queryParams.append("date_from", filters.date_from);
    if (filters.date_to)
        queryParams.append("date_to", filters.date_to);
    if (filters.filter_test_accounts !== undefined)
        queryParams.append("filter_test_accounts", filters.filter_test_accounts.toString());
    if (filters.host)
        queryParams.append("host", filters.host);
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/api/projects/${projectId}/web_analytics/overview/?${queryParams.toString()}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 404) {
            throw new Error(`Web Analytics API is not enabled for your PostHog instance. This feature is in beta and requires activation. Please contact PostHog support to enable web analytics endpoints for your team. Error: ${response.status} ${errorText}`);
        }
        throw new Error(`Failed to get web analytics: ${response.status} ${errorText}`);
    }
    const webAnalytics = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(webAnalytics, null, 2),
            },
        ],
    };
};
exports.getWebAnalyticsHandler = getWebAnalyticsHandler;
const tool = () => ({
    name: "get-web-analytics",
    description: `
        - Get web analytics overview data for the project (visitors, views, sessions, bounce rate, session duration).
        - This feature is in beta and requires activation by PostHog support.
        - Supports filtering by date range, host, and test account filtering.
        - Returns overview metrics: visitors, views, sessions, bounce_rate, session_duration.
    `,
    schema,
    handler: exports.getWebAnalyticsHandler,
});
exports.default = tool;
