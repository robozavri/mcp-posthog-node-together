import type { z } from "zod";
import { WebAnalyticsStatisticSchema } from "@/schema/tool-inputs";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { handleToolError } from "@/lib/utils/handleToolError";
import type { Context, Tool } from "../types";

type Params = z.infer<typeof WebAnalyticsStatisticSchema>;

const schema = WebAnalyticsStatisticSchema;

export const getStatisticHandler = async (context: Context, params: Params) => {
	try {
		const { period = "today", custom_days } = params;
		const projectId = await context.getProjectId();

		// Calculate date ranges based on period
		const { currentStart, currentEnd, previousStart, previousEnd } = calculateDateRanges(period, custom_days);

		// Get current period statistics
		const currentStats = await getWebAnalyticsStats(context, projectId, currentStart, currentEnd);
		
		// Get previous period statistics for comparison
		const previousStats = await getWebAnalyticsStats(context, projectId, previousStart, previousEnd);

		// Calculate metrics with comparisons
		const metrics = calculateMetricsWithComparison(currentStats, previousStats);

		return {
			period,
			current_period: {
				start_date: currentStart,
				end_date: currentEnd,
			},
			previous_period: {
				start_date: previousStart,
				end_date: previousEnd,
			},
			metrics,
		};
	} catch (error) {
		return handleToolError(error, "Failed to get web analytics statistics");
	}
};

function calculateDateRanges(period: string, customDays?: number) {
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	
	let currentStart: string;
	let currentEnd: string;
	let previousStart: string;
	let previousEnd: string;

	switch (period) {
		case "today":
			currentStart = today.toISOString().split('T')[0];
			currentEnd = today.toISOString().split('T')[0];
			previousStart = new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			previousEnd = new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			break;
		case "yesterday":
			currentStart = new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			currentEnd = new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			previousStart = new Date(today.getTime() - 48 * 60 * 60 * 1000).toISOString().split('T')[0];
			previousEnd = new Date(today.getTime() - 48 * 60 * 60 * 1000).toISOString().split('T')[0];
			break;
		case "last_24_hours":
			currentStart = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
			currentEnd = now.toISOString();
			previousStart = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();
			previousEnd = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
			break;
		case "last_7_days":
			currentStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			currentEnd = today.toISOString().split('T')[0];
			previousStart = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			previousEnd = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			break;
		case "last_14_days":
			currentStart = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			currentEnd = today.toISOString().split('T')[0];
			previousStart = new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			previousEnd = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			break;
		case "last_30_days":
			currentStart = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			currentEnd = today.toISOString().split('T')[0];
			previousStart = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			previousEnd = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			break;
		case "last_90_days":
			currentStart = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			currentEnd = today.toISOString().split('T')[0];
			previousStart = new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			previousEnd = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			break;
		case "last_180_days":
			currentStart = new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			currentEnd = today.toISOString().split('T')[0];
			previousStart = new Date(today.getTime() - 360 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			previousEnd = new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			break;
		case "this_month": {
			const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
			currentStart = firstDayOfMonth.toISOString().split('T')[0];
			currentEnd = today.toISOString().split('T')[0];
			const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
			const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
			previousStart = firstDayOfLastMonth.toISOString().split('T')[0];
			previousEnd = lastDayOfLastMonth.toISOString().split('T')[0];
			break;
		}
		case "all_time":
			currentStart = "2020-01-01"; // Arbitrary start date
			currentEnd = today.toISOString().split('T')[0];
			previousStart = "2020-01-01";
			previousEnd = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			break;
		case "custom":
			if (!customDays) {
				throw new Error("custom_days is required when period is 'custom'");
			}
			currentStart = new Date(today.getTime() - customDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			currentEnd = today.toISOString().split('T')[0];
			previousStart = new Date(today.getTime() - customDays * 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			previousEnd = new Date(today.getTime() - customDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			break;
		default:
			throw new Error(`Invalid period: ${period}`);
	}

	return { currentStart, currentEnd, previousStart, previousEnd };
}

async function getWebAnalyticsStats(context: Context, projectId: string, startDate: string, endDate: string) {
	const url = `${getProjectBaseUrl(projectId)}/query/`;
	
	const query = `
		WITH page_views AS (
			SELECT
				distinct_id,
				timestamp,
				properties.$session_id AS session_id,
				properties.path AS path
			FROM events
			WHERE
				event = '$pageview'
				AND timestamp >= toDate('${startDate}')
				AND timestamp <= toDate('${endDate}')
		),
		session_data AS (
			SELECT
				session_id,
				distinct_id,
				COUNT(*) AS page_views_in_session,
				MIN(timestamp) AS session_start,
				MAX(timestamp) AS session_end,
				dateDiff('second', MIN(timestamp), MAX(timestamp)) AS session_duration_seconds
			FROM page_views
			GROUP BY session_id, distinct_id
		),
		bounce_sessions AS (
			SELECT session_id
			FROM session_data
			WHERE page_views_in_session = 1
		)
		SELECT
			COUNT(DISTINCT distinct_id) AS visitors,
			COUNT(*) AS page_views,
			COUNT(DISTINCT session_id) AS sessions,
			AVG(session_duration_seconds) AS avg_session_duration_seconds,
			COUNT(DISTINCT bounce_sessions.session_id) AS bounce_sessions,
			COUNT(DISTINCT session_id) AS total_sessions
		FROM page_views
		LEFT JOIN bounce_sessions ON page_views.session_id = bounce_sessions.session_id
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
	const results = data.results[0];

	return {
		visitors: results[0] || 0,
		page_views: results[1] || 0,
		sessions: results[2] || 0,
		avg_session_duration_seconds: results[3] || 0,
		bounce_sessions: results[4] || 0,
		total_sessions: results[5] || 0,
	};
}

function calculateMetricsWithComparison(current: any, previous: any) {
	const calculatePercentageChange = (current: number, previous: number) => {
		if (previous === 0) {
			return current > 0 ? 100 : 0;
		}
		return Math.round(((current - previous) / previous) * 100);
	};

	const formatDuration = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);
		return `${minutes}m ${remainingSeconds}s`;
	};

	const calculateBounceRate = (bounceSessions: number, totalSessions: number) => {
		if (totalSessions === 0) return 0;
		return Math.round((bounceSessions / totalSessions) * 100);
	};

	const currentBounceRate = calculateBounceRate(current.bounce_sessions, current.total_sessions);
	const previousBounceRate = calculateBounceRate(previous.bounce_sessions, previous.total_sessions);

	return {
		visitors: {
			current: current.visitors,
			previous: previous.visitors,
			change_percentage: calculatePercentageChange(current.visitors, previous.visitors),
			description: `Visitors: ${current.visitors}`,
			comparison: `Visitors: ${calculatePercentageChange(current.visitors, previous.visitors) >= 0 ? 'increased' : 'decreased'} by ${Math.abs(calculatePercentageChange(current.visitors, previous.visitors))}%, to ${current.visitors} from ${previous.visitors}`,
		},
		page_views: {
			current: current.page_views,
			previous: previous.page_views,
			change_percentage: calculatePercentageChange(current.page_views, previous.page_views),
			description: `Page views: ${current.page_views}`,
			comparison: `Page views: ${calculatePercentageChange(current.page_views, previous.page_views) >= 0 ? 'increased' : 'decreased'} by ${Math.abs(calculatePercentageChange(current.page_views, previous.page_views))}%, to ${current.page_views} from ${previous.page_views}`,
		},
		sessions: {
			current: current.sessions,
			previous: previous.sessions,
			change_percentage: calculatePercentageChange(current.sessions, previous.sessions),
			description: `Sessions: ${current.sessions}`,
			comparison: `Sessions: ${calculatePercentageChange(current.sessions, previous.sessions) >= 0 ? 'increased' : 'decreased'} by ${Math.abs(calculatePercentageChange(current.sessions, previous.sessions))}%, to ${current.sessions} from ${previous.sessions}`,
		},
		session_duration: {
			current_seconds: current.avg_session_duration_seconds,
			previous_seconds: previous.avg_session_duration_seconds,
			current_formatted: formatDuration(current.avg_session_duration_seconds),
			previous_formatted: formatDuration(previous.avg_session_duration_seconds),
			change_percentage: calculatePercentageChange(current.avg_session_duration_seconds, previous.avg_session_duration_seconds),
			description: `Session duration: ${formatDuration(current.avg_session_duration_seconds)}`,
			comparison: `Session duration: ${calculatePercentageChange(current.avg_session_duration_seconds, previous.avg_session_duration_seconds) >= 0 ? 'increased' : 'decreased'} by ${Math.abs(calculatePercentageChange(current.avg_session_duration_seconds, previous.avg_session_duration_seconds))}%, to ${formatDuration(current.avg_session_duration_seconds)} from ${formatDuration(previous.avg_session_duration_seconds)}`,
		},
		bounce_rate: {
			current: currentBounceRate,
			previous: previousBounceRate,
			change_percentage: calculatePercentageChange(currentBounceRate, previousBounceRate),
			description: `Bounce rate: ${currentBounceRate}%`,
			comparison: `Bounce rate: ${calculatePercentageChange(currentBounceRate, previousBounceRate) >= 0 ? 'increased' : 'decreased'} by ${Math.abs(calculatePercentageChange(currentBounceRate, previousBounceRate))}%, to ${currentBounceRate}% from ${previousBounceRate}%`,
		},
	};
}

const tool = (): Tool<typeof schema> => ({
	name: "get-web-statistic",
	description: "Get comprehensive web analytics statistics with comparison data including visitors, page views, sessions, session duration, and bounce rate",
	schema,
	handler: getStatisticHandler,
});

export default tool; 