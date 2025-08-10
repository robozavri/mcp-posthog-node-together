"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTrendsHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.TrendsGetAllSchema;
const getAllTrendsHandler = async (context, params) => {
    const projectId = await context.getProjectId();
    const { data } = params;
    const queryParams = new URLSearchParams();
    if (data?.limit)
        queryParams.append("limit", data.limit.toString());
    if (data?.offset)
        queryParams.append("offset", data.offset.toString());
    if (data?.search)
        queryParams.append("search", data.search);
    if (data?.date_from)
        queryParams.append("date_from", data.date_from);
    if (data?.date_to)
        queryParams.append("date_to", data.date_to);
    // Always filter for trend insights
    queryParams.append("insight", "trends");
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/insights/?${queryParams.toString()}`;
    try {
        console.log("=== TRENDS DEBUGGING START ===");
        console.log("Fetching trends from:", url);
        console.log("Project ID:", projectId);
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
            throw new Error(`Failed to get trends: ${response.status} ${errorText}`);
        }
        const result = await response.json();
        console.log("Raw API response:", JSON.stringify(result, null, 2));
        // Filter to ensure we only get trend insights
        const trendInsights = result.results?.filter((insight) => {
            // Check multiple possible ways trend insights might be identified
            const isTrend = (insight.filters?.insight === "trends" ||
                insight.insight === "trends" ||
                insight.query?.kind === "TrendsQuery" ||
                insight.query?.insight === "trends" ||
                insight.filters?.display?.toLowerCase().includes("trend") ||
                insight.name?.toLowerCase().includes("trend") ||
                !insight.filters?.insight || // Default insights are trends
                insight.insight === undefined // Default insights are trends
            );
            console.log("Insight", insight.id, ": isTrend=", isTrend, ", insight=", insight.insight, ", filters.insight=", insight.filters?.insight, ", query.kind=", insight.query?.kind, ", name=", insight.name);
            return isTrend;
        }) || [];
        console.log("Found", trendInsights.length, "trend insights out of", result.results?.length || 0, "total insights");
        if (trendInsights.length === 0) {
            // Try alternative approach - get all insights and filter client-side
            const allInsightsUrl = `${(0, api_1.getProjectBaseUrl)(projectId)}/insights/`;
            console.log("Trying alternative approach:", allInsightsUrl);
            const allResponse = await fetch(allInsightsUrl, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${context.apiToken}`,
                    "Content-Type": "application/json",
                },
            });
            if (allResponse.ok) {
                const allResult = await allResponse.json();
                console.log("All insights found:", allResult.results?.length || 0);
                // Log all insight types for debugging
                const insightTypes = allResult.results?.map((insight) => ({
                    id: insight.id,
                    name: insight.name,
                    insight: insight.insight,
                    filters_insight: insight.filters?.insight,
                    query_kind: insight.query?.kind,
                    query_insight: insight.query?.insight,
                    display: insight.filters?.display,
                    short_id: insight.short_id,
                })) || [];
                console.log("All insight types:", JSON.stringify(insightTypes, null, 2));
                // Try different filtering approaches for trends
                const alternativeTrends1 = allResult.results?.filter((insight) => {
                    const isTrend = (insight.filters?.insight === "trends" ||
                        insight.insight === "trends" ||
                        insight.query?.kind === "TrendsQuery" ||
                        insight.query?.insight === "trends");
                    if (isTrend) {
                        console.log("Method 1 found trend:", insight.id, insight.name);
                    }
                    return isTrend;
                }) || [];
                const alternativeTrends2 = allResult.results?.filter((insight) => {
                    const isTrend = (insight.name?.toLowerCase().includes("trend") ||
                        insight.filters?.display?.toLowerCase().includes("trend"));
                    if (isTrend) {
                        console.log("Method 2 found trend:", insight.id, insight.name);
                    }
                    return isTrend;
                }) || [];
                const alternativeTrends3 = allResult.results?.filter((insight) => {
                    // Check for default insights (which are trends)
                    const isTrend = (!insight.filters?.insight ||
                        insight.insight === undefined ||
                        insight.insight === null);
                    if (isTrend) {
                        console.log("Method 3 found trend (default):", insight.id, insight.name);
                    }
                    return isTrend;
                }) || [];
                // Check for insights with trend-like structure
                const alternativeTrends4 = allResult.results?.filter((insight) => {
                    // Look for insights that have time series data
                    const hasTimeSeriesData = insight.result?.result?.length > 0;
                    const hasTrendData = insight.result?.insights?.length > 0;
                    const hasChartData = insight.result?.chart_data?.length > 0;
                    const isTrend = hasTimeSeriesData || hasTrendData || hasChartData;
                    if (isTrend) {
                        console.log("Method 4 found trend:", insight.id, insight.name, {
                            hasTimeSeriesData,
                            hasTrendData,
                            hasChartData
                        });
                    }
                    return isTrend;
                }) || [];
                console.log("Alternative approach 1 (strict trend check):", alternativeTrends1.length);
                console.log("Alternative approach 2 (name contains trend):", alternativeTrends2.length);
                console.log("Alternative approach 3 (default insights):", alternativeTrends3.length);
                console.log("Alternative approach 4 (trend-like structure):", alternativeTrends4.length);
                // Combine all approaches and remove duplicates using a Map
                const trendMap = new Map();
                // Add trends from each method to the map
                const allTrendArrays = [alternativeTrends1, alternativeTrends2, alternativeTrends3, alternativeTrends4];
                for (let methodIndex = 0; methodIndex < allTrendArrays.length; methodIndex++) {
                    const trends = allTrendArrays[methodIndex];
                    for (const trend of trends) {
                        if (!trendMap.has(trend.id)) {
                            trendMap.set(trend.id, {
                                trend,
                                detectionMethods: [methodIndex + 1]
                            });
                        }
                        else {
                            trendMap.get(trend.id).detectionMethods.push(methodIndex + 1);
                        }
                    }
                }
                const allPossibleTrends = Array.from(trendMap.values()).map(item => item.trend);
                console.log("Total possible trends found:", allPossibleTrends.length);
                console.log("Trend IDs found:", allPossibleTrends.map((t) => t.id));
                console.log("Trend detection details:", Array.from(trendMap.entries()).map(([id, item]) => ({
                    id,
                    name: item.trend.name,
                    detectionMethods: item.detectionMethods
                })));
                if (allPossibleTrends.length > 0) {
                    const formattedTrends = allPossibleTrends.map((trend) => {
                        const detectionMethods = trendMap.get(trend.id)?.detectionMethods || [];
                        return {
                            id: trend.id,
                            short_id: trend.short_id,
                            name: trend.name || trend.filters?.display || "Unnamed Trend",
                            description: trend.description || "No description",
                            created_at: trend.created_at,
                            updated_at: trend.updated_at,
                            insight_type: trend.insight,
                            filters_insight: trend.filters?.insight,
                            query_kind: trend.query?.kind,
                            events: trend.filters?.events || trend.query?.series || [],
                            interval: trend.filters?.interval,
                            aggregation: trend.filters?.aggregation,
                            breakdown_by: trend.filters?.breakdown_by,
                            chart_type: trend.filters?.chart_type,
                            smoothing: trend.filters?.smoothing,
                            url: trend.url,
                            detection_methods: detectionMethods,
                        };
                    });
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Found ${formattedTrends.length} possible trend insights (using multiple detection methods):\n${JSON.stringify(formattedTrends, null, 2)}`,
                            },
                        ],
                    };
                }
                // If still no trends found, return all insights for debugging
                const allInsightsFormatted = allResult.results?.map((insight) => ({
                    id: insight.id,
                    short_id: insight.short_id,
                    name: insight.name || insight.filters?.display || "Unnamed Insight",
                    description: insight.description || "No description",
                    insight_type: insight.insight,
                    filters_insight: insight.filters?.insight,
                    query_kind: insight.query?.kind,
                    query_insight: insight.query?.insight,
                    display: insight.filters?.display,
                    events_count: insight.filters?.events?.length || insight.query?.series?.length || 0,
                    created_at: insight.created_at,
                    updated_at: insight.updated_at,
                })) || [];
                return {
                    content: [
                        {
                            type: "text",
                            text: `No trend insights found, but here are all ${allInsightsFormatted.length} insights in your project for debugging:\n${JSON.stringify(allInsightsFormatted, null, 2)}`,
                        },
                    ],
                };
            }
            // Provide detailed diagnostic information
            const diagnosticInfo = {
                projectId: projectId,
                totalInsightsFound: result.results?.length || 0,
                apiUrl: url,
                responseStatus: response.status,
                message: "No trend insights found. This could mean: 1) No trends created yet, 2) Wrong project ID, 3) API permissions issue, or 4) Trends exist but with different structure."
            };
            console.log("=== TRENDS DEBUGGING END ===");
            return {
                content: [
                    {
                        type: "text",
                        text: `No trend insights found in this project. You can create trends using the PostHog interface or the create-trend tool. Make sure you have created trend insights in your PostHog project first.\n\nDiagnostic Information:\n${JSON.stringify(diagnosticInfo, null, 2)}`,
                    },
                ],
            };
        }
        // Format the response to be more readable
        const formattedTrends = trendInsights.map((trend) => ({
            id: trend.id,
            short_id: trend.short_id,
            name: trend.name || trend.filters?.display || "Unnamed Trend",
            description: trend.description || "No description",
            created_at: trend.created_at,
            updated_at: trend.updated_at,
            insight_type: trend.insight,
            filters_insight: trend.filters?.insight,
            query_kind: trend.query?.kind,
            events: trend.filters?.events || trend.query?.series || [],
            interval: trend.filters?.interval,
            aggregation: trend.filters?.aggregation,
            breakdown_by: trend.filters?.breakdown_by,
            chart_type: trend.filters?.chart_type,
            smoothing: trend.filters?.smoothing,
            url: trend.url,
        }));
        console.log("=== TRENDS DEBUGGING END ===");
        return {
            content: [
                {
                    type: "text",
                    text: `Found ${formattedTrends.length} trend insights:\n${JSON.stringify(formattedTrends, null, 2)}`,
                },
            ],
        };
    }
    catch (error) {
        console.log("=== TRENDS DEBUGGING ERROR ===");
        console.log("Error:", error);
        throw new Error(`Error fetching trends: ${error instanceof Error ? error.message : String(error)}`);
    }
};
exports.getAllTrendsHandler = getAllTrendsHandler;
const tool = () => ({
    name: "get-all-trends",
    description: `
        - List all trend insights in a project.
        - Supports filtering by search terms, insight type, and date range.
        - Returns paginated results with trend configurations and metadata.
        - Can be used to discover existing trends for analysis.
        - Shows trend name, description, events, interval, aggregation, and chart type.
        - If no trends are found, make sure you have created trend insights in your PostHog project first.
        - Includes detailed diagnostic information to help troubleshoot issues.
        - Uses multiple detection methods to find trends with different structures.
        - If no trends are found, returns all insights for debugging purposes.
        - Uses 4 different detection methods to find all possible trends.
        - Provides detailed console logging for debugging.
        - Shows which detection methods found each trend.
        - Trends are the default insight type in PostHog.
    `,
    schema,
    handler: exports.getAllTrendsHandler,
});
exports.default = tool;
