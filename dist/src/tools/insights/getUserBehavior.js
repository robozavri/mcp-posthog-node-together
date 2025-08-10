"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserBehaviorHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
/**
 * User Behavior Tool
 *
 * This tool retrieves user behavior analytics including session duration,
 * bounce rate, and engagement metrics from PostHog.
 *
 * Usage Examples:
 * 1. Get user behavior for last 30 days:
 *    {"period": "last_30_days"}
 *
 * 2. Get user behavior for specific date range:
 *    {"start_date": "2024-01-01", "end_date": "2024-01-31"}
 *
 * 3. Get user behavior with filter:
 *    {"period": "last_30_days", "filter": "/blog"}
 *
 * 4. Get user behavior with pagination:
 *    {"period": "last_30_days", "limit": 20, "offset": 10}
 *
 * The tool provides comprehensive user behavior analytics.
 */
const schema = tool_inputs_1.UserBehaviorSchema;
const getUserBehaviorHandler = async (context, params) => {
    const { period, start_date, end_date, limit = 50, offset = 0, filter } = params;
    const projectId = await context.getProjectId();
    // Validate that either period is specified OR both start_date and end_date are specified
    if (!period && (!start_date || !end_date)) {
        throw new Error("Either specify a period OR provide both start_date and end_date");
    }
    // Calculate date range based on period or provided dates
    let queryStartDate;
    let queryEndDate;
    if (period) {
        const today = new Date();
        queryEndDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
        switch (period) {
            case "last_7_days":
                queryStartDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                break;
            case "last_30_days":
                queryStartDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                break;
            case "last_90_days":
                queryStartDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                break;
            case "last_180_days":
                queryStartDate = new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                break;
            case "last_365_days":
                queryStartDate = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                break;
            default:
                queryStartDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Default to last 30 days
        }
    }
    else {
        queryStartDate = start_date;
        queryEndDate = end_date;
    }
    // Build filter clause if provided
    const filterClause = filter ? `AND properties.path LIKE '%${filter}%'` : "";
    // Build comprehensive HogQL query for user behavior
    const query = `
		WITH user_sessions AS (
			SELECT 
				distinct_id,
				properties.$session_id AS session_id,
				timestamp,
				properties.path AS path,
				properties.$referrer AS referrer,
				properties.$current_url AS current_url
			FROM events
			WHERE 
				event = '$pageview'
				AND timestamp >= toDate('${queryStartDate}')
				AND timestamp <= toDate('${queryEndDate}')
				${filterClause}
		),
		session_metrics AS (
			SELECT 
				session_id,
				distinct_id,
				COUNT(*) AS page_views_in_session,
				MIN(timestamp) AS session_start,
				MAX(timestamp) AS session_end,
				dateDiff('second', MIN(timestamp), MAX(timestamp)) AS session_duration_seconds
			FROM user_sessions
			GROUP BY session_id, distinct_id
		),
		user_metrics AS (
			SELECT 
				distinct_id,
				COUNT(DISTINCT session_id) AS total_sessions,
				AVG(session_duration_seconds) AS avg_session_duration,
				SUM(page_views_in_session) AS total_page_views,
				AVG(page_views_in_session) AS avg_page_views_per_session
			FROM session_metrics
			GROUP BY distinct_id
		),
		bounce_sessions AS (
			SELECT 
				session_id,
				distinct_id
			FROM session_metrics
			WHERE page_views_in_session = 1
		)
		SELECT 
			um.distinct_id,
			um.total_sessions,
			ROUND(um.avg_session_duration, 2) AS average_session_duration_seconds,
			um.total_page_views,
			ROUND(um.avg_page_views_per_session, 2) AS avg_page_views_per_session,
			ROUND(COUNT(bs.session_id) * 100.0 / um.total_sessions, 2) AS bounce_rate_percent,
			ROUND(um.avg_session_duration / 60.0, 2) AS avg_session_duration_minutes
		FROM user_metrics um
		LEFT JOIN bounce_sessions bs ON um.distinct_id = bs.distinct_id
		GROUP BY um.distinct_id, um.total_sessions, um.avg_session_duration, um.total_page_views, um.avg_page_views_per_session
		ORDER BY um.total_sessions DESC, um.avg_session_duration DESC
		LIMIT ${limit}
		OFFSET ${offset}
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
        throw new Error(`Failed to get user behavior: ${response.status} ${errorText}`);
    }
    const result = await response.json();
    // Format the results with user behavior metrics
    const formattedResults = result.results?.map((row) => ({
        user_id: row[0] || "Unknown",
        total_sessions: Number.parseInt(row[1], 10) || 0,
        average_session_duration_seconds: Number.parseFloat(row[2]) || 0,
        total_page_views: Number.parseInt(row[3], 10) || 0,
        avg_page_views_per_session: Number.parseFloat(row[4]) || 0,
        bounce_rate_percent: Number.parseFloat(row[5]) || 0,
        avg_session_duration_minutes: Number.parseFloat(row[6]) || 0
    })) || [];
    // Create comprehensive summary statistics
    const totalUsers = formattedResults.length;
    const totalSessions = formattedResults.reduce((sum, item) => sum + item.total_sessions, 0);
    const totalPageViews = formattedResults.reduce((sum, item) => sum + item.total_page_views, 0);
    const totalBounceSessions = formattedResults.reduce((sum, item) => sum + (item.bounce_rate_percent * item.total_sessions / 100), 0);
    const averageSessionsPerUser = totalUsers > 0 ? totalSessions / totalUsers : 0;
    const averageSessionDuration = formattedResults.length > 0 ?
        formattedResults.reduce((sum, item) => sum + item.average_session_duration_seconds, 0) / formattedResults.length : 0;
    const averagePageViewsPerSession = totalSessions > 0 ? totalPageViews / totalSessions : 0;
    const overallBounceRate = totalSessions > 0 ? (totalBounceSessions / totalSessions) * 100 : 0;
    // Find users with best and worst engagement
    const mostEngagedUser = formattedResults.length > 0
        ? formattedResults.reduce((best, current) => current.average_session_duration_seconds > best.average_session_duration_seconds ? current : best) : null;
    const leastEngagedUser = formattedResults.length > 0
        ? formattedResults.reduce((worst, current) => current.average_session_duration_seconds < worst.average_session_duration_seconds ? current : worst) : null;
    const mostActiveUser = formattedResults.length > 0
        ? formattedResults.reduce((best, current) => current.total_sessions > best.total_sessions ? current : best) : null;
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify({
                    period: period || null,
                    start_date: queryStartDate,
                    end_date: queryEndDate,
                    filter: filter || "all_users",
                    limit,
                    offset,
                    query: query.trim(),
                    summary: {
                        total_users: totalUsers,
                        total_sessions: totalSessions,
                        total_page_views: totalPageViews,
                        average_sessions_per_user: Math.round(averageSessionsPerUser * 100) / 100,
                        average_session_duration_seconds: Math.round(averageSessionDuration * 100) / 100,
                        average_session_duration_minutes: Math.round((averageSessionDuration / 60) * 100) / 100,
                        average_page_views_per_session: Math.round(averagePageViewsPerSession * 100) / 100,
                        overall_bounce_rate_percent: Math.round(overallBounceRate * 100) / 100,
                        most_engaged_user: mostEngagedUser ? {
                            user_id: mostEngagedUser.user_id,
                            avg_session_duration_seconds: mostEngagedUser.average_session_duration_seconds,
                            avg_session_duration_minutes: mostEngagedUser.avg_session_duration_minutes,
                            total_sessions: mostEngagedUser.total_sessions
                        } : null,
                        least_engaged_user: leastEngagedUser ? {
                            user_id: leastEngagedUser.user_id,
                            avg_session_duration_seconds: leastEngagedUser.average_session_duration_seconds,
                            avg_session_duration_minutes: leastEngagedUser.avg_session_duration_minutes,
                            total_sessions: leastEngagedUser.total_sessions
                        } : null,
                        most_active_user: mostActiveUser ? {
                            user_id: mostActiveUser.user_id,
                            total_sessions: mostActiveUser.total_sessions,
                            total_page_views: mostActiveUser.total_page_views,
                            avg_session_duration_seconds: mostActiveUser.average_session_duration_seconds
                        } : null
                    },
                    results: formattedResults
                }, null, 2),
            },
        ],
    };
};
exports.getUserBehaviorHandler = getUserBehaviorHandler;
const tool = () => ({
    name: "get-user-behavior",
    description: `
		- Get user behavior analytics including session duration, bounce rate, and engagement metrics.
		- Provides average session duration, bounce rate, and sessions per user.
		- Includes detailed user engagement analysis and behavior patterns.
		- Supports predefined periods (last_7_days, last_30_days, etc.) or custom date ranges.
		- Supports path-based filtering and pagination.
		- Returns comprehensive summary with user engagement insights.
		- Example usage: {"period": "last_30_days", "limit": 20} or {"start_date": "2024-01-01", "end_date": "2024-01-31", "limit": 20}
	`,
    schema,
    handler: exports.getUserBehaviorHandler,
});
exports.default = tool;
