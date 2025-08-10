import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { PageViewsSchema } from "@/schema/tool-inputs";

/**
 * Page Views Tool
 * 
 * This tool retrieves page view statistics from PostHog.
 * 
 * Usage Examples:
 * 1. Get top 50 pages for last month:
 *    {"start_date": "2024-01-01", "end_date": "2024-01-31"}
 * 
 * 2. Get top 10 pages for last week:
 *    {"start_date": "2024-01-22", "end_date": "2024-01-28", "limit": 10}
 * 
 * 3. Get pages with specific filter:
 *    {"start_date": "2024-01-01", "end_date": "2024-01-31", "filter": "/blog"}
 * 
 * 4. Get pages with pagination:
 *    {"start_date": "2024-01-01", "end_date": "2024-01-31", "limit": 20, "offset": 20}
 * 
 * The tool uses HogQL queries to analyze page view events.
 */

const schema = PageViewsSchema;

type Params = z.infer<typeof schema>;

export const getPageViewsHandler = async (context: Context, params: Params) => {
	const { days = 7, filter } = params;
	const projectId = await context.getProjectId();

	// Calculate date range based on days parameter
	const today = new Date();
	const queryEndDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
	const queryStartDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

	// Build filter clause if provided
	const filterClause = filter ? `AND properties.path LIKE '%${filter}%'` : "";

	// Build HogQL query for page views
	const query = `
		SELECT 
			properties.path AS path,
			COUNT(*) AS total_views,
			COUNT(DISTINCT distinct_id) AS unique_visitors,
			ROUND(COUNT(*) * 1.0 / COUNT(DISTINCT distinct_id), 2) AS avg_views_per_visitor
		FROM events
		WHERE 
			event = '$pageview'
			AND timestamp >= toDate('${queryStartDate}')
			AND timestamp <= toDate('${queryEndDate}')
			${filterClause}
		GROUP BY path
		ORDER BY total_views DESC
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
		throw new Error(`Failed to get page views: ${response.status} ${errorText}`);
	}

	const result = await response.json();

	// Format the results
	const formattedResults = result.results?.map((row: any) => ({
		path: row[0] || "Unknown",
		total_views: Number.parseInt(row[1], 10) || 0,
		unique_visitors: Number.parseInt(row[2], 10) || 0,
		avg_views_per_visitor: Number.parseFloat(row[3]) || 0
	})) || [];

	// Create summary statistics
	const totalPages = formattedResults.length;
	const totalViews = formattedResults.reduce((sum: number, item: { total_views: number }) => sum + item.total_views, 0);
	const totalVisitors = formattedResults.reduce((sum: number, item: { unique_visitors: number }) => sum + item.unique_visitors, 0);
	const averageViewsPerPage = totalPages > 0 ? totalViews / totalPages : 0;
	const averageViewsPerVisitor = totalVisitors > 0 ? totalViews / totalVisitors : 0;

	// Find top performing pages
	const topPage = formattedResults.length > 0 ? formattedResults[0] : null;
	const leastViewedPage = formattedResults.length > 0 ? formattedResults[formattedResults.length - 1] : null;

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
						average_views_per_page: Math.round(averageViewsPerPage * 100) / 100,
						average_views_per_visitor: Math.round(averageViewsPerVisitor * 100) / 100,
						top_page: topPage ? {
							path: topPage.path,
							views: topPage.total_views,
							visitors: topPage.unique_visitors
						} : null,
						least_viewed_page: leastViewedPage ? {
							path: leastViewedPage.path,
							views: leastViewedPage.total_views,
							visitors: leastViewedPage.unique_visitors
						} : null
					},
					results: formattedResults
				}, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-page-views",
	description: `
		- Get page view statistics from PostHog.
		- Shows total views, unique visitors, and average views per visitor for each page.
		- Uses days parameter to specify time range (e.g., 20 for last 20 days, 34 for last 34 days).
		- Defaults to last 7 days if not specified.
		- Supports path-based filtering.
		- Returns comprehensive summary statistics.
		- Example usage: {"days": 20} or {"days": 34, "filter": "/blog"}
	`,
	schema,
	handler: getPageViewsHandler,
});

export default tool; 