import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { TrendsGetSchema } from "@/schema/tool-inputs";

const schema = TrendsGetSchema;

type Params = z.infer<typeof schema>;

export const getTrendHandler = async (context: Context, params: Params) => {
	const { projectId, insightId } = params;

	const url = `${getProjectBaseUrl(String(projectId))}/insights/${insightId}/`;
	
	try {
		console.log("=== TREND DEBUGGING START ===");
		console.log("Fetching trend from:", url);
		console.log("Project ID:", projectId);
		console.log("Insight ID:", insightId);
		console.log("API Token (first 10 chars):", `${context.apiToken.substring(0, 10)}...`);
		
		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${context.apiToken}`,
				"Content-Type": "application/json",
			},
		});

		console.log("Response status:", response.status);
		console.log("Response headers:", Object.fromEntries(response.headers.entries()));

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Failed to get trend: ${response.status} ${errorText}`);
		}

		const result = await response.json();
		console.log("Raw API response:", JSON.stringify(result, null, 2));

		// Verify this is actually a trend insight
		const isTrend = result.filters?.insight === "trends" || 
						result.insight === "trends" || 
						result.query?.kind === "TrendsQuery" ||
						result.query?.insight === "trends" ||
						!result.filters?.insight || // Default insights are trends
						result.insight === undefined; // Default insights are trends

		if (!isTrend) {
			return {
				content: [
					{
						type: "text",
						text: `Insight with ID ${insightId} is not a trend insight. It appears to be a different type of insight (${result.insight || result.filters?.insight || 'unknown'}).`,
					},
				],
			};
		}

		// Format the trend data for better readability
		const formattedTrend = {
			id: result.id,
			short_id: result.short_id,
			name: result.name || result.filters?.display || "Unnamed Trend",
			description: result.description || "No description",
			created_at: result.created_at,
			updated_at: result.updated_at,
			insight_type: result.insight,
			filters_insight: result.filters?.insight,
			query_kind: result.query?.kind,
			events: result.filters?.events || result.query?.series || [],
			interval: result.filters?.interval || "day",
			aggregation: result.filters?.aggregation || "total_count",
			breakdown_by: result.filters?.breakdown_by,
			chart_type: result.filters?.chart_type || "line",
			smoothing: result.filters?.smoothing || false,
			global_filters: result.filters?.properties || [],
			date_from: result.filters?.date_from,
			date_to: result.filters?.date_to,
			results: result.result || {},
			url: result.url,
			// Additional trend-specific information
			time_series_data: result.result?.result || [],
			chart_data: result.result?.chart_data || [],
			insights: result.result?.insights || [],
			last_refresh: result.last_refresh,
			is_cached: result.is_cached,
			refresh_frequency: result.refresh_frequency,
		};

		console.log("=== TREND DEBUGGING END ===");

		return {
			content: [
				{
					type: "text",
					text: `Trend Insight Details:\n${JSON.stringify(formattedTrend, null, 2)}`,
				},
			],
		};
	} catch (error) {
		console.log("=== TREND DEBUGGING ERROR ===");
		console.log("Error:", error);
		throw new Error(`Error fetching trend: ${error instanceof Error ? error.message : String(error)}`);
	}
};

const tool = (): Tool<typeof schema> => ({
	name: "get-trend",
	description: `
        - Get a specific trend insight by ID.
        - Returns detailed information about the trend including events, configuration, and results.
        - Includes trend results and metadata.
        - Shows interval, aggregation method, breakdown settings, and chart type.
        - Displays time series data, chart data, and insights.
        - Shows caching information and refresh frequency.
        - Trends are the default insight type in PostHog.
        - Includes detailed diagnostic information to help troubleshoot issues.
    `,
	schema,
	handler: getTrendHandler,
});

export default tool; 