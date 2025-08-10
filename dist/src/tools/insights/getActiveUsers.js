"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveUsersHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
/**
 * Active Users Tool
 *
 * This tool retrieves daily or weekly active users from PostHog.
 *
 * Usage Examples:
 * 1. Get daily active users for last 30 days:
 *    {"interval": "daily"}
 *
 * 2. Get weekly active users for last 12 weeks:
 *    {"interval": "weekly"}
 *
 * 3. Get daily active users for last 20 days:
 *    {"interval": "daily", "limit": 20}
 *
 * The tool uses HogQL queries:
 * - Daily: SELECT toDate(timestamp) AS date, count(DISTINCT distinct_id) AS active_users FROM events GROUP BY date ORDER BY date DESC LIMIT 30
 * - Weekly: SELECT toStartOfWeek(timestamp) AS date, count(DISTINCT distinct_id) AS active_users FROM events GROUP BY date ORDER BY date DESC LIMIT 12
 */
const schema = tool_inputs_1.ActiveUsersSchema;
const getActiveUsersHandler = async (context, params) => {
    const { interval = "daily", date_from, date_to } = params;
    const projectId = await context.getProjectId();
    // Calculate date range
    let startDate;
    let endDate;
    if (date_from && date_to) {
        startDate = date_from;
        endDate = date_to;
    }
    else {
        // Default date range based on interval
        const now = new Date();
        endDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
        if (interval === "weekly") {
            // Last 12 weeks
            const startDateObj = new Date(now);
            startDateObj.setDate(now.getDate() - (12 * 7));
            startDate = startDateObj.toISOString().split('T')[0];
        }
        else {
            // Last 30 days
            const startDateObj = new Date(now);
            startDateObj.setDate(now.getDate() - 30);
            startDate = startDateObj.toISOString().split('T')[0];
        }
    }
    // Build HogQL query based on interval
    const dateFunction = interval === "weekly" ? "toStartOfWeek" : "toDate";
    const query = `
		SELECT 
			${dateFunction}(timestamp) AS date, 
			count(DISTINCT distinct_id) AS active_users
		FROM events
		WHERE timestamp >= toDate('${startDate}')
		AND timestamp <= toDate('${endDate}')
		GROUP BY date
		ORDER BY date DESC
	`;
    const payload = {
        query: {
            kind: "HogQLQuery",
            query: query.trim()
        }
    };
    const url = `${(0, api_1.getProjectBaseUrl)(String(projectId))}/query/`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get active users: ${response.status} ${errorText}`);
    }
    const result = await response.json();
    // Format the results
    const formattedResults = result.results?.map((row) => ({
        date: row[0],
        active_users: Number.parseInt(row[1], 10) || 0
    })) || [];
    // Create a summary
    const totalActiveUsers = formattedResults.reduce((sum, item) => item.active_users + sum, 0);
    const averageActiveUsers = formattedResults.length > 0 ? totalActiveUsers / formattedResults.length : 0;
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify({
                    interval,
                    query: query.trim(),
                    summary: {
                        total_periods: formattedResults.length,
                        total_active_users: totalActiveUsers,
                        average_active_users: Math.round(averageActiveUsers)
                    },
                    results: formattedResults
                }, null, 2),
            },
        ],
    };
};
exports.getActiveUsersHandler = getActiveUsersHandler;
const tool = () => ({
    name: "get-active-users",
    description: `
		- Get daily or weekly active users count for the project.
		- Shows the number of unique users that use your app every day or week.
		- Returns data with date and active_users count.
		- Defaults to daily interval if not specified.
		- Default date range: last 30 days for daily, last 12 weeks for weekly.
		- Can specify custom date range with date_from and date_to parameters.
		- Uses HogQL query to count distinct users grouped by time interval.
		- Example usage: {"interval": "daily"} or {"interval": "weekly", "date_from": "2024-01-01", "date_to": "2024-01-31"}
	`,
    schema,
    handler: exports.getActiveUsersHandler,
});
exports.default = tool;
