"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebAnalyticsBreakdownHandler = void 0;
const tool_inputs_1 = require("@/schema/tool-inputs");
const api_1 = require("@/lib/utils/api");
const handleToolError_1 = require("@/lib/utils/handleToolError");
const schema = tool_inputs_1.WebAnalyticsBreakdownSchema;
const getWebAnalyticsBreakdownHandler = async (context, params) => {
    try {
        console.log('Breakdown handler started with params:', params);
        const { period = "last_7_days", group_by = "day", custom_days } = params;
        const projectId = await context.getProjectId();
        // If custom_days is provided but period is not "custom", use custom period
        let actualPeriod = period;
        if (custom_days && period !== "custom") {
            actualPeriod = "custom";
        }
        // Calculate date ranges based on period
        const { startDate, endDate } = calculateDateRange(actualPeriod, custom_days);
        console.log('Date range:', { startDate, endDate, group_by });
        // Get analytics breakdown
        const breakdown = await getWebAnalyticsBreakdown(context, projectId, startDate, endDate, group_by);
        console.log('Breakdown result:', breakdown);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        period: actualPeriod,
                        group_by: group_by,
                        custom_days: custom_days,
                        date_range: {
                            start: startDate,
                            end: endDate
                        },
                        unique_visitors: breakdown.unique_visitors,
                        page_views: breakdown.page_views,
                        unique_sessions: breakdown.unique_sessions
                    }, null, 2),
                },
            ],
        };
    }
    catch (error) {
        console.error('Error in breakdown handler:', error);
        return (0, handleToolError_1.handleToolError)(error, "Failed to get web analytics breakdown");
    }
};
exports.getWebAnalyticsBreakdownHandler = getWebAnalyticsBreakdownHandler;
function calculateDateRange(period, customDays) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let startDate;
    let endDate;
    switch (period) {
        case "today":
            startDate = today.toISOString().split('T')[0];
            endDate = today.toISOString().split('T')[0];
            break;
        case "yesterday":
            startDate = new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            endDate = new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            break;
        case "last_24_hours":
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
            endDate = now.toISOString();
            break;
        case "last_7_days":
            startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            endDate = today.toISOString().split('T')[0];
            break;
        case "last_14_days":
            startDate = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            endDate = today.toISOString().split('T')[0];
            break;
        case "last_30_days":
            startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            endDate = today.toISOString().split('T')[0];
            break;
        case "last_90_days":
            startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            endDate = today.toISOString().split('T')[0];
            break;
        case "last_180_days":
            startDate = new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            endDate = today.toISOString().split('T')[0];
            break;
        case "this_month": {
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            startDate = firstDayOfMonth.toISOString().split('T')[0];
            endDate = today.toISOString().split('T')[0];
            break;
        }
        case "all_time":
            startDate = "2020-01-01"; // Arbitrary start date
            endDate = today.toISOString().split('T')[0];
            break;
        case "custom":
            if (!customDays) {
                throw new Error("custom_days is required when period is 'custom'");
            }
            startDate = new Date(today.getTime() - customDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            endDate = today.toISOString().split('T')[0];
            break;
        default:
            throw new Error(`Invalid period: ${period}`);
    }
    return { startDate, endDate };
}
async function getWebAnalyticsBreakdown(context, projectId, startDate, endDate, groupBy) {
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/query/`;
    // Determine the time grouping function based on group_by parameter
    let timeGrouping;
    switch (groupBy) {
        case "hour":
            timeGrouping = "toStartOfHour(timestamp)";
            break;
        case "day":
            timeGrouping = "toDate(timestamp)";
            break;
        case "week":
            timeGrouping = "toStartOfWeek(timestamp)";
            break;
        case "month":
            timeGrouping = "toStartOfMonth(timestamp)";
            break;
        default:
            timeGrouping = "toDate(timestamp)";
    }
    // Query for unique visitors, page views, and unique sessions grouped by time
    const query = `
		SELECT
			${timeGrouping} AS time_period,
			COUNT(DISTINCT distinct_id) AS unique_visitors,
			COUNT(*) AS page_views,
			COUNT(DISTINCT properties.$session_id) AS unique_sessions
		FROM events
		WHERE
			event = '$pageview'
			AND timestamp >= toDate('${startDate}')
			AND timestamp <= toDate('${endDate}')
		GROUP BY time_period
		ORDER BY time_period DESC
	`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${context.apiToken}`,
        },
        body: JSON.stringify({
            query: {
                kind: "HogQLQuery",
                query,
            },
        }),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const results = data.results || [];
    // Format the results
    const formattedResults = results.map((row) => ({
        time_period: row[0],
        unique_visitors: row[1] || 0,
        page_views: row[2] || 0,
        unique_sessions: row[3] || 0,
    }));
    return {
        unique_visitors: formattedResults,
        page_views: formattedResults,
        unique_sessions: formattedResults
    };
}
const tool = () => ({
    name: "get-web-analytics-breakdown",
    description: "Get detailed web analytics breakdown including unique visitors, page views, and unique sessions grouped by time intervals (hour, day, week, month)",
    schema,
    handler: exports.getWebAnalyticsBreakdownHandler,
});
exports.default = tool;
