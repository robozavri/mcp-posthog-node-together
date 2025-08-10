"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDetailedPageViewsHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
/**
 * Detailed Page Views Tool
 *
 * This tool retrieves detailed page view statistics with additional analytics
 * including bounce rate, session duration, and user engagement metrics.
 *
 * Usage Examples:
 * 1. Get detailed page analytics for last month:
 *    {"start_date": "2024-01-01", "end_date": "2024-01-31"}
 *
 * 2. Get detailed blog analytics:
 *    {"start_date": "2024-01-01", "end_date": "2024-01-31", "filter": "/blog"}
 *
 * 3. Get top 20 pages with detailed metrics:
 *    {"start_date": "2024-01-01", "end_date": "2024-01-31", "limit": 20}
 *
 * The tool provides comprehensive page performance analytics.
 */
const schema = tool_inputs_1.PageViewsSchema;
const getDetailedPageViewsHandler = async (context, params) => {
    const { days = 7, filter } = params;
    const projectId = await context.getProjectId();
    // Calculate date range based on days parameter
    const today = new Date();
    const queryEndDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    const queryStartDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    // Build filter clause if provided
    const filterClause = filter ? `AND properties.path LIKE '%${filter}%'` : "";
    // Build comprehensive HogQL query for detailed page views
    const query = `
		WITH page_views AS (
			SELECT 
				properties.path AS path,
				distinct_id,
				timestamp,
				properties.$session_id AS session_id,
				properties.$referrer AS referrer,
				properties.$current_url AS current_url
			FROM events
			WHERE 
				event = '$pageview'
				AND timestamp >= toDate('${queryStartDate}')
				AND timestamp <= toDate('${queryEndDate}')
				${filterClause}
		),
		session_stats AS (
			SELECT 
				path,
				session_id,
				COUNT(*) AS page_views_in_session,
				MIN(timestamp) AS first_view,
				MAX(timestamp) AS last_view,
				dateDiff('second', MIN(timestamp), MAX(timestamp)) AS session_duration_seconds
			FROM page_views
			GROUP BY path, session_id
		),
		user_stats AS (
			SELECT 
				path,
				distinct_id,
				COUNT(*) AS total_views_by_user,
				COUNT(DISTINCT session_id) AS sessions_by_user
			FROM page_views
			GROUP BY path, distinct_id
		)
		SELECT 
			pv.path,
			COUNT(pv.path) AS total_views,
			COUNT(DISTINCT pv.distinct_id) AS unique_visitors,
			COUNT(DISTINCT pv.session_id) AS total_sessions,
			ROUND(COUNT(pv.path) * 1.0 / COUNT(DISTINCT pv.distinct_id), 2) AS avg_views_per_visitor,
			ROUND(COUNT(pv.path) * 1.0 / COUNT(DISTINCT pv.session_id), 2) AS avg_views_per_session,
			ROUND(AVG(ss.session_duration_seconds), 2) AS avg_session_duration_seconds,
			ROUND(AVG(us.total_views_by_user), 2) AS avg_views_per_user,
			ROUND(AVG(us.sessions_by_user), 2) AS avg_sessions_per_user,
			COUNT(DISTINCT multiIf(ss.page_views_in_session = 1, ss.session_id, NULL)) AS bounce_sessions,
			ROUND(COUNT(DISTINCT multiIf(ss.page_views_in_session = 1, ss.session_id, NULL)) * 100.0 / COUNT(DISTINCT pv.session_id), 2) AS bounce_rate_percent
		FROM page_views pv
		LEFT JOIN session_stats ss ON pv.path = ss.path AND pv.session_id = ss.session_id
		LEFT JOIN user_stats us ON pv.path = us.path AND pv.distinct_id = us.distinct_id
		GROUP BY pv.path
		ORDER BY total_views DESC
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
        throw new Error(`Failed to get detailed page views: ${response.status} ${errorText}`);
    }
    const result = await response.json();
    // Format the results with detailed metrics
    const formattedResults = result.results?.map((row) => ({
        path: row[0] || "Unknown",
        total_views: Number.parseInt(row[1], 10) || 0,
        unique_visitors: Number.parseInt(row[2], 10) || 0,
        total_sessions: Number.parseInt(row[3], 10) || 0,
        avg_views_per_visitor: Number.parseFloat(row[4]) || 0,
        avg_views_per_session: Number.parseFloat(row[5]) || 0,
        avg_session_duration_seconds: Number.parseFloat(row[6]) || 0,
        avg_views_per_user: Number.parseFloat(row[7]) || 0,
        avg_sessions_per_user: Number.parseFloat(row[8]) || 0,
        bounce_sessions: Number.parseInt(row[9], 10) || 0,
        bounce_rate_percent: Number.parseFloat(row[10]) || 0
    })) || [];
    // Create comprehensive summary statistics
    const totalPages = formattedResults.length;
    const totalViews = formattedResults.reduce((sum, item) => sum + item.total_views, 0);
    const totalVisitors = formattedResults.reduce((sum, item) => sum + item.unique_visitors, 0);
    const totalSessions = formattedResults.reduce((sum, item) => sum + item.total_sessions, 0);
    const totalBounceSessions = formattedResults.reduce((sum, item) => sum + item.bounce_sessions, 0);
    const averageViewsPerPage = totalPages > 0 ? totalViews / totalPages : 0;
    const averageViewsPerVisitor = totalVisitors > 0 ? totalViews / totalVisitors : 0;
    const averageViewsPerSession = totalSessions > 0 ? totalViews / totalSessions : 0;
    const overallBounceRate = totalSessions > 0 ? (totalBounceSessions / totalSessions) * 100 : 0;
    // Find top and least performing pages
    const topPage = formattedResults.length > 0 ? formattedResults[0] : null;
    const leastViewedPage = formattedResults.length > 0 ? formattedResults[formattedResults.length - 1] : null;
    // Find pages with best and worst engagement
    const bestEngagementPage = formattedResults.length > 0
        ? formattedResults.reduce((best, current) => current.avg_views_per_visitor > best.avg_views_per_visitor ? current : best) : null;
    const worstBounceRatePage = formattedResults.length > 0
        ? formattedResults.reduce((worst, current) => current.bounce_rate_percent > worst.bounce_rate_percent ? current : worst) : null;
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify({
                    days,
                    start_date: queryStartDate,
                    end_date: queryEndDate,
                    filter: filter || "all_pages",
                    query: query.trim(),
                    summary: {
                        total_pages: totalPages,
                        total_views: totalViews,
                        total_unique_visitors: totalVisitors,
                        total_sessions: totalSessions,
                        total_bounce_sessions: totalBounceSessions,
                        average_views_per_page: Math.round(averageViewsPerPage * 100) / 100,
                        average_views_per_visitor: Math.round(averageViewsPerVisitor * 100) / 100,
                        average_views_per_session: Math.round(averageViewsPerSession * 100) / 100,
                        overall_bounce_rate_percent: Math.round(overallBounceRate * 100) / 100,
                        top_page: topPage ? {
                            path: topPage.path,
                            views: topPage.total_views,
                            visitors: topPage.unique_visitors,
                            sessions: topPage.total_sessions,
                            bounce_rate: topPage.bounce_rate_percent
                        } : null,
                        least_viewed_page: leastViewedPage ? {
                            path: leastViewedPage.path,
                            views: leastViewedPage.total_views,
                            visitors: leastViewedPage.unique_visitors,
                            sessions: leastViewedPage.total_sessions,
                            bounce_rate: leastViewedPage.bounce_rate_percent
                        } : null,
                        best_engagement_page: bestEngagementPage ? {
                            path: bestEngagementPage.path,
                            avg_views_per_visitor: bestEngagementPage.avg_views_per_visitor,
                            avg_session_duration: bestEngagementPage.avg_session_duration_seconds
                        } : null,
                        worst_bounce_rate_page: worstBounceRatePage ? {
                            path: worstBounceRatePage.path,
                            bounce_rate: worstBounceRatePage.bounce_rate_percent,
                            views: worstBounceRatePage.total_views
                        } : null
                    },
                    results: formattedResults
                }, null, 2),
            },
        ],
    };
};
exports.getDetailedPageViewsHandler = getDetailedPageViewsHandler;
const tool = () => ({
    name: "get-detailed-page-views",
    description: `
		- Get detailed page view statistics with comprehensive analytics.
		- Includes bounce rate, session duration, and user engagement metrics.
		- Provides detailed session and user behavior analysis.
		- Uses days parameter to specify time range (e.g., 20 for last 20 days, 34 for last 34 days).
		- Defaults to last 7 days if not specified.
		- Supports path-based filtering.
		- Returns comprehensive summary with engagement insights.
		- Example usage: {"days": 20} or {"days": 34, "filter": "/blog"}
	`,
    schema,
    handler: exports.getDetailedPageViewsHandler,
});
exports.default = tool;
