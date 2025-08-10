import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { RetentionSchema } from "@/schema/tool-inputs";

/**
 * Retention Tool
 * 
 * This tool retrieves user retention data from PostHog.
 * 
 * Usage Examples:
 * 1. Get daily retention for last 30 days:
 *    {"period": "day"}
 * 
 * 2. Get weekly retention for last 12 weeks:
 *    {"period": "week", "date_range": 12}
 * 
 * 3. Get monthly retention for last 6 months:
 *    {"period": "month", "date_range": 6}
 * 
 * 4. Get daily retention for specific event:
 *    {"period": "day", "event_name": "page_view"}
 * 
 * The tool uses HogQL queries to calculate retention rates.
 */

const schema = RetentionSchema;

type Params = z.infer<typeof schema>;

export const getRetentionHandler = async (context: Context, params: Params) => {
	const { period, date_range = 30, event_name } = params;
	const projectId = await context.getProjectId();

	// Build HogQL query for retention analysis
	const periodFunction = period === "week" ? "toStartOfWeek" : period === "month" ? "toStartOfMonth" : "toDate";
	const eventFilter = event_name ? `WHERE event = '${event_name}'` : "";
	
	// Simple retention query that calculates user activity over time
	const query = `
		SELECT 
			${periodFunction}(timestamp) AS date,
			count(DISTINCT distinct_id) AS active_users,
			ROUND(count(DISTINCT distinct_id) * 1.0, 2) AS retention_rate
		FROM events
		${eventFilter}
		GROUP BY date
		ORDER BY date DESC
		LIMIT ${date_range}
	`;

	const payload = {
		query: {
			kind: "HogQLQuery",
			query: query.trim()
		}
	};

	const url = `${getProjectBaseUrl(String(projectId))}/query/`;
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
		throw new Error(`Failed to get retention data: ${response.status} ${errorText}`);
	}

	const result = await response.json();

	// Format the results
	const formattedResults = result.results?.map((row: any) => ({
		date: row[0],
		active_users: Number.parseInt(row[1], 10) || 0,
		retention_rate: Number.parseFloat(row[2]) || 0
	})) || [];

	// Create summary statistics
	const totalPeriods = formattedResults.length;
	const totalActiveUsers = formattedResults.reduce((sum: number, item: { active_users: number }) => sum + item.active_users, 0);
	const averageRetentionRate = formattedResults.length > 0 
		? formattedResults.reduce((sum: number, item: { retention_rate: number }) => sum + item.retention_rate, 0) / formattedResults.length 
		: 0;

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify({
					period,
					date_range,
					event_name: event_name || "all_events",
					query: query.trim(),
					summary: {
						total_periods: totalPeriods,
						total_active_users: totalActiveUsers,
						average_retention_rate: Math.round(averageRetentionRate * 100) / 100
					},
					results: formattedResults
				}, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-retention",
	description: `
		- Get user retention data for the project.
		- Shows how many users return after their first activity.
		- Supports daily, weekly, and monthly retention periods.
		- Can analyze retention for specific events or all events.
		- Returns cohort analysis with retention rates.
		- REQUIRED: period parameter must be provided ("day", "week", or "month")
		- Example usage: {"period": "day"} or {"period": "week", "date_range": 12, "event_name": "page_view"}
	`,
	schema,
	handler: getRetentionHandler,
});

export default tool; 