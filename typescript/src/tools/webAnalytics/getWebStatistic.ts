import type { z } from "zod";
import { WebAnalyticsStatisticSchema } from "@/schema/tool-inputs";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { handleToolError } from "@/lib/utils/handleToolError";
import type { Context, Tool } from "../types";

type Params = z.infer<typeof WebAnalyticsStatisticSchema>;

const schema = WebAnalyticsStatisticSchema;

export const getStatisticHandler = async (context: Context, params: Params) => {
	try {
		console.log('Handler started with params:', params);
		
		const { period = "today", custom_days } = params;
		const projectId = await context.getProjectId();
		
		// If custom_days is provided but period is not "custom", use custom period
		let actualPeriod = period;
		if (custom_days && period !== "custom") {
			actualPeriod = "custom";
		}

		// Calculate date ranges based on period
		const { currentStart, currentEnd, previousStart, previousEnd } = calculateDateRanges(actualPeriod, custom_days);
		
		console.log('Date ranges:', { currentStart, currentEnd, previousStart, previousEnd });

		// Get current period statistics - ONLY VISITORS FOR NOW
		const currentStats = await getWebAnalyticsStats(context, projectId, currentStart, currentEnd);
		console.log('Current stats:', currentStats);
		
		// Get previous period statistics for comparison
		const previousStats = await getWebAnalyticsStats(context, projectId, previousStart, previousEnd);
		console.log('Previous stats:', previousStats);

		// Calculate percentage change
		const calculatePercentageChange = (current: number, previous: number) => {
			if (previous === 0) {
				return current > 0 ? 100 : 0;
			}
			return Math.round(((current - previous) / previous) * 100);
		};

		// Format duration in minutes and seconds
		const formatDuration = (seconds: number) => {
			const minutes = Math.floor(seconds / 60);
			const remainingSeconds = Math.floor(seconds % 60);
			return `${minutes}m ${remainingSeconds}s`;
		};

		const visitorsChangePercentage = calculatePercentageChange(currentStats.visitors, previousStats.visitors);
		const pageViewsChangePercentage = calculatePercentageChange(currentStats.page_views, previousStats.page_views);
		const sessionsChangePercentage = calculatePercentageChange(currentStats.sessions, previousStats.sessions);
		const sessionDurationChangePercentage = calculatePercentageChange(currentStats.avg_session_duration_seconds, previousStats.avg_session_duration_seconds);
		
		// Calculate bounce rates
		const currentBounceRate = currentStats.sessions > 0 ? Math.round((currentStats.bounce_sessions / currentStats.sessions) * 100) : 0;
		const previousBounceRate = previousStats.sessions > 0 ? Math.round((previousStats.bounce_sessions / previousStats.sessions) * 100) : 0;
		const bounceRateChangePercentage = calculatePercentageChange(currentBounceRate, previousBounceRate);
		
		console.log('Final result:', {
			visitors: currentStats.visitors,
			previous_visitors: previousStats.visitors,
			visitors_change_percentage: visitorsChangePercentage,
			page_views: currentStats.page_views,
			previous_page_views: previousStats.page_views,
			page_views_change_percentage: pageViewsChangePercentage,
			sessions: currentStats.sessions,
			previous_sessions: previousStats.sessions,
			sessions_change_percentage: sessionsChangePercentage,
			session_duration: currentStats.avg_session_duration_seconds,
			previous_session_duration: previousStats.avg_session_duration_seconds,
			session_duration_change_percentage: sessionDurationChangePercentage,
			bounce_rate: currentBounceRate,
			previous_bounce_rate: previousBounceRate,
			bounce_rate_change_percentage: bounceRateChangePercentage
		});

		return {
			content: [
				{
					type: "text",
					text: JSON.stringify({
						visitors: {
							current: currentStats.visitors,
							previous: previousStats.visitors,
							change_percentage: visitorsChangePercentage,
							comparison: `Visitors: ${visitorsChangePercentage >= 0 ? 'increased' : 'decreased'} by ${Math.abs(visitorsChangePercentage)}%, to ${currentStats.visitors} from ${previousStats.visitors}`
						},
						page_views: {
							current: currentStats.page_views,
							previous: previousStats.page_views,
							change_percentage: pageViewsChangePercentage,
							comparison: `Page views: ${pageViewsChangePercentage >= 0 ? 'increased' : 'decreased'} by ${Math.abs(pageViewsChangePercentage)}%, to ${currentStats.page_views} from ${previousStats.page_views}`
						},
						sessions: {
							current: currentStats.sessions,
							previous: previousStats.sessions,
							change_percentage: sessionsChangePercentage,
							comparison: `Sessions: ${sessionsChangePercentage >= 0 ? 'increased' : 'decreased'} by ${Math.abs(sessionsChangePercentage)}%, to ${currentStats.sessions} from ${previousStats.sessions}`
						},
						session_duration: {
							current_seconds: currentStats.avg_session_duration_seconds,
							previous_seconds: previousStats.avg_session_duration_seconds,
							current_formatted: formatDuration(currentStats.avg_session_duration_seconds),
							previous_formatted: formatDuration(previousStats.avg_session_duration_seconds),
							change_percentage: sessionDurationChangePercentage,
							comparison: `Session duration: ${sessionDurationChangePercentage >= 0 ? 'increased' : 'decreased'} by ${Math.abs(sessionDurationChangePercentage)}%, to ${formatDuration(currentStats.avg_session_duration_seconds)} from ${formatDuration(previousStats.avg_session_duration_seconds)}`
						},
						bounce_rate: {
							current: currentBounceRate,
							previous: previousBounceRate,
							change_percentage: bounceRateChangePercentage,
							comparison: `Bounce rate: ${bounceRateChangePercentage >= 0 ? 'increased' : 'decreased'} by ${Math.abs(bounceRateChangePercentage)}%, to ${currentBounceRate}% from ${previousBounceRate}%`
						},
						period: actualPeriod,
						custom_days: custom_days,
						date_ranges: {
							current_start: currentStart,
							current_end: currentEnd,
							previous_start: previousStart,
							previous_end: previousEnd
						}
					}, null, 2),
				},
			],
		};
	} catch (error) {
		console.error('Error in handler:', error);
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
	
			// Simple query to check if we have any events
		const simpleQuery = `
			SELECT
				COUNT(*) AS total_events,
				COUNT(DISTINCT distinct_id) AS unique_users,
				COUNT(DISTINCT event) AS unique_events
			FROM events
			WHERE
				timestamp >= toDate('${startDate}')
				AND timestamp <= toDate('${endDate}')
		`;
		
		const simpleResponse = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${context.apiToken}`,
			},
			body: JSON.stringify({
				query: {
					kind: "HogQLQuery",
					query: simpleQuery,
				},
			}),
		});
		
		if (!simpleResponse.ok) {
			throw new Error(`Simple query failed! status: ${simpleResponse.status}`);
		}
		
		const simpleData = await simpleResponse.json();
	
	// Query for visitors, page views, and sessions (simplified)
	const query = `
		SELECT
			COUNT(DISTINCT distinct_id) AS visitors,
			COUNT(*) AS page_views,
			COUNT(DISTINCT properties.$session_id) AS sessions
		FROM events
		WHERE
			event = '$pageview'
			AND timestamp >= toDate('${startDate}')
			AND timestamp <= toDate('${endDate}')
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
					query: query,
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
		avg_session_duration_seconds: 0, // Temporarily set to 0
		bounce_sessions: 0, // Temporarily set to 0
		// total_sessions: results[5] || 0,
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
		// page_views: {
		// 	current: current.page_views,
		// 	previous: previous.page_views,
		// 	change_percentage: calculatePercentageChange(current.page_views, previous.page_views),
		// 	description: `Page views: ${current.page_views}`,
		// 	comparison: `Page views: ${calculatePercentageChange(current.page_views, previous.page_views) >= 0 ? 'increased' : 'decreased'} by ${Math.abs(calculatePercentageChange(current.page_views, previous.page_views))}%, to ${current.page_views} from ${previous.page_views}`,
		// },
		// sessions: {
		// 	current: current.sessions,
		// 	previous: previous.sessions,
		// 	change_percentage: calculatePercentageChange(current.sessions, previous.sessions),
		// 	description: `Sessions: ${current.sessions}`,
		// 	comparison: `Sessions: ${calculatePercentageChange(current.sessions, previous.sessions) >= 0 ? 'increased' : 'decreased'} by ${Math.abs(calculatePercentageChange(current.sessions, previous.sessions))}%, to ${current.sessions} from ${previous.sessions}`,
		// },
		// session_duration: {
		// 	current_seconds: current.avg_session_duration_seconds,
		// 	previous_seconds: previous.avg_session_duration_seconds,
		// 	current_formatted: formatDuration(current.avg_session_duration_seconds),
		// 	previous_formatted: formatDuration(previous.avg_session_duration_seconds),
		// 	change_percentage: calculatePercentageChange(current.avg_session_duration_seconds, previous.avg_session_duration_seconds),
		// 	description: `Session duration: ${formatDuration(current.avg_session_duration_seconds)}`,
		// 	comparison: `Session duration: ${calculatePercentageChange(current.avg_session_duration_seconds, previous.avg_session_duration_seconds) >= 0 ? 'increased' : 'decreased'} by ${Math.abs(calculatePercentageChange(current.avg_session_duration_seconds, previous.avg_session_duration_seconds))}%, to ${formatDuration(current.avg_session_duration_seconds)} from ${formatDuration(previous.avg_session_duration_seconds)}`,
		// },
		// bounce_rate: {
		// 	current: currentBounceRate,
		// 	previous: previousBounceRate,
		// 	change_percentage: calculatePercentageChange(currentBounceRate, previousBounceRate),
		// 	description: `Bounce rate: ${currentBounceRate}%`,
		// 	comparison: `Bounce rate: ${calculatePercentageChange(currentBounceRate, previousBounceRate) >= 0 ? 'increased' : 'decreased'} by ${Math.abs(calculatePercentageChange(currentBounceRate, previousBounceRate))}%, to ${currentBounceRate}% from ${previousBounceRate}%`,
		// },
	};
}

const tool = (): Tool<typeof schema> => ({
	name: "get-web-statistic",
	description: "Get comprehensive web analytics statistics with comparison data including visitors, page views, sessions, session duration, and bounce rate",
	schema,
	handler: getStatisticHandler,
});

export default tool; 