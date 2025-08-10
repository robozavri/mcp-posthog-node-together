"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFunnelsHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.FunnelGetAllSchema;
const getAllFunnelsHandler = async (context, params) => {
    const projectId = await context.getProjectId();
    const { data } = params;
    const queryParams = new URLSearchParams();
    if (data?.limit)
        queryParams.append("limit", data.limit.toString());
    if (data?.offset)
        queryParams.append("offset", data.offset.toString());
    if (data?.search)
        queryParams.append("search", data.search);
    // Always filter for funnel insights
    queryParams.append("insight", "funnels");
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/insights/?${queryParams.toString()}`;
    try {
        console.log("=== FUNNEL DEBUGGING START ===");
        console.log("Fetching funnels from:", url);
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
            throw new Error(`Failed to get funnels: ${response.status} ${errorText}`);
        }
        const result = await response.json();
        console.log("Raw API response:", JSON.stringify(result, null, 2));
        // Additional filtering to ensure we only get funnel insights
        const funnelInsights = result.results?.filter((insight) => {
            // Check multiple possible ways funnel insights might be identified
            const isFunnel = (insight.filters?.insight === "funnels" ||
                insight.insight === "funnels" ||
                insight.query?.kind === "FunnelQuery" ||
                insight.query?.insight === "funnels" ||
                insight.filters?.display?.toLowerCase().includes("funnel") ||
                insight.name?.toLowerCase().includes("funnel"));
            console.log("Insight", insight.id, ": isFunnel=", isFunnel, ", insight=", insight.insight, ", filters.insight=", insight.filters?.insight, ", query.kind=", insight.query?.kind, ", name=", insight.name);
            return isFunnel;
        }) || [];
        console.log("Found", funnelInsights.length, "funnel insights out of", result.results?.length || 0, "total insights");
        if (funnelInsights.length === 0) {
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
                // Try different filtering approaches
                const alternativeFunnels1 = allResult.results?.filter((insight) => {
                    const isFunnel = (insight.filters?.insight === "funnels" ||
                        insight.insight === "funnels" ||
                        insight.query?.kind === "FunnelQuery" ||
                        insight.query?.insight === "funnels");
                    if (isFunnel) {
                        console.log("Method 1 found funnel:", insight.id, insight.name);
                    }
                    return isFunnel;
                }) || [];
                const alternativeFunnels2 = allResult.results?.filter((insight) => {
                    const isFunnel = (insight.name?.toLowerCase().includes("funnel") ||
                        insight.filters?.display?.toLowerCase().includes("funnel"));
                    if (isFunnel) {
                        console.log("Method 2 found funnel:", insight.id, insight.name);
                    }
                    return isFunnel;
                }) || [];
                const alternativeFunnels3 = allResult.results?.filter((insight) => {
                    // Check if it has funnel-like structure
                    const isFunnel = (insight.filters?.events?.length > 1 ||
                        insight.query?.series?.length > 1);
                    if (isFunnel) {
                        console.log("Method 3 found funnel:", insight.id, insight.name, "events:", insight.filters?.events?.length, "series:", insight.query?.series?.length);
                    }
                    return isFunnel;
                }) || [];
                // New comprehensive approach - check for any insight that might be a funnel
                const alternativeFunnels4 = allResult.results?.filter((insight) => {
                    // Check for any insight that has multiple events or steps
                    const hasMultipleEvents = insight.filters?.events?.length > 1;
                    const hasMultipleSeries = insight.query?.series?.length > 1;
                    const hasFunnelInName = insight.name?.toLowerCase().includes("funnel");
                    const hasFunnelInDisplay = insight.filters?.display?.toLowerCase().includes("funnel");
                    const hasConversionData = insight.result?.conversion_rate !== undefined;
                    const hasDropOffData = insight.result?.drop_off_rate !== undefined;
                    const isFunnel = hasMultipleEvents || hasMultipleSeries || hasFunnelInName || hasFunnelInDisplay || hasConversionData || hasDropOffData;
                    if (isFunnel) {
                        console.log("Method 4 found funnel:", insight.id, insight.name, {
                            hasMultipleEvents,
                            hasMultipleSeries,
                            hasFunnelInName,
                            hasFunnelInDisplay,
                            hasConversionData,
                            hasDropOffData
                        });
                    }
                    return isFunnel;
                }) || [];
                // Check for insights with specific funnel patterns
                const alternativeFunnels5 = allResult.results?.filter((insight) => {
                    // Look for insights that have step-by-step structure
                    const events = insight.filters?.events || insight.query?.series || [];
                    const hasSequentialSteps = events.length > 1 && events.every((event, index) => {
                        return event.order === index + 1 || event.step === index + 1;
                    });
                    if (hasSequentialSteps) {
                        console.log("Method 5 found funnel:", insight.id, insight.name, "sequential steps:", events.length);
                    }
                    return hasSequentialSteps;
                }) || [];
                console.log("Alternative approach 1 (strict funnel check):", alternativeFunnels1.length);
                console.log("Alternative approach 2 (name contains funnel):", alternativeFunnels2.length);
                console.log("Alternative approach 3 (multiple events):", alternativeFunnels3.length);
                console.log("Alternative approach 4 (comprehensive check):", alternativeFunnels4.length);
                console.log("Alternative approach 5 (sequential steps):", alternativeFunnels5.length);
                // Combine all approaches and remove duplicates using a Map
                const funnelMap = new Map();
                // Add funnels from each method to the map
                const allFunnelArrays = [alternativeFunnels1, alternativeFunnels2, alternativeFunnels3, alternativeFunnels4, alternativeFunnels5];
                for (let methodIndex = 0; methodIndex < allFunnelArrays.length; methodIndex++) {
                    const funnels = allFunnelArrays[methodIndex];
                    for (const funnel of funnels) {
                        if (!funnelMap.has(funnel.id)) {
                            funnelMap.set(funnel.id, {
                                funnel,
                                detectionMethods: [methodIndex + 1]
                            });
                        }
                        else {
                            funnelMap.get(funnel.id).detectionMethods.push(methodIndex + 1);
                        }
                    }
                }
                const allPossibleFunnels = Array.from(funnelMap.values()).map(item => item.funnel);
                console.log("Total possible funnels found:", allPossibleFunnels.length);
                console.log("Funnel IDs found:", allPossibleFunnels.map((f) => f.id));
                console.log("Funnel detection details:", Array.from(funnelMap.entries()).map(([id, item]) => ({
                    id,
                    name: item.funnel.name,
                    detectionMethods: item.detectionMethods
                })));
                if (allPossibleFunnels.length > 0) {
                    const formattedFunnels = allPossibleFunnels.map((funnel) => {
                        const detectionMethods = funnelMap.get(funnel.id)?.detectionMethods || [];
                        return {
                            id: funnel.id,
                            short_id: funnel.short_id,
                            name: funnel.name || funnel.filters?.display || "Unnamed Funnel",
                            description: funnel.description || "No description",
                            created_at: funnel.created_at,
                            updated_at: funnel.updated_at,
                            insight_type: funnel.insight,
                            filters_insight: funnel.filters?.insight,
                            query_kind: funnel.query?.kind,
                            steps: funnel.filters?.events || funnel.query?.series || [],
                            conversion_rate: funnel.result?.conversion_rate,
                            drop_off_rate: funnel.result?.drop_off_rate,
                            url: funnel.url,
                            detection_methods: detectionMethods,
                        };
                    });
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Found ${formattedFunnels.length} possible funnel insights (using multiple detection methods):\n${JSON.stringify(formattedFunnels, null, 2)}`,
                            },
                        ],
                    };
                }
                // If still no funnels found, return all insights for debugging
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
                            text: `No funnel insights found, but here are all ${allInsightsFormatted.length} insights in your project for debugging:\n${JSON.stringify(allInsightsFormatted, null, 2)}`,
                        },
                    ],
                };
            }
            // Try different API endpoints
            console.log("Trying different API endpoints...");
            // Try without insight filter
            const noFilterUrl = `${(0, api_1.getProjectBaseUrl)(projectId)}/insights/`;
            const noFilterResponse = await fetch(noFilterUrl, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${context.apiToken}`,
                    "Content-Type": "application/json",
                },
            });
            if (noFilterResponse.ok) {
                const noFilterResult = await noFilterResponse.json();
                console.log("No filter response insights:", noFilterResult.results?.length || 0);
                const noFilterFunnels = noFilterResult.results?.filter((insight) => {
                    return (insight.filters?.insight === "funnels" ||
                        insight.insight === "funnels" ||
                        insight.query?.kind === "FunnelQuery" ||
                        insight.query?.insight === "funnels" ||
                        insight.name?.toLowerCase().includes("funnel"));
                }) || [];
                console.log("No filter funnels found:", noFilterFunnels.length);
                if (noFilterFunnels.length > 0) {
                    const formattedFunnels = noFilterFunnels.map((funnel) => ({
                        id: funnel.id,
                        short_id: funnel.short_id,
                        name: funnel.name || funnel.filters?.display || "Unnamed Funnel",
                        description: funnel.description || "No description",
                        created_at: funnel.created_at,
                        updated_at: funnel.updated_at,
                        insight_type: funnel.insight,
                        filters_insight: funnel.filters?.insight,
                        query_kind: funnel.query?.kind,
                        steps: funnel.filters?.events || funnel.query?.series || [],
                        conversion_rate: funnel.result?.conversion_rate,
                        drop_off_rate: funnel.result?.drop_off_rate,
                        url: funnel.url,
                    }));
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Found ${formattedFunnels.length} funnel insights (using no filter approach):\n${JSON.stringify(formattedFunnels, null, 2)}`,
                            },
                        ],
                    };
                }
            }
            // Provide detailed diagnostic information
            const diagnosticInfo = {
                projectId: projectId,
                totalInsightsFound: result.results?.length || 0,
                allInsightsTypes: allResponse.ok ? (await allResponse.json()).results?.map((insight) => insight.insight) || [] : [],
                apiUrl: url,
                responseStatus: response.status,
                message: "No funnel insights found. This could mean: 1) No funnels created yet, 2) Wrong project ID, 3) API permissions issue, or 4) Funnels exist but with different structure."
            };
            console.log("=== FUNNEL DEBUGGING END ===");
            return {
                content: [
                    {
                        type: "text",
                        text: `No funnel insights found in this project. You can create funnels using the PostHog interface or the create-funnel tool. Make sure you have created funnel insights in your PostHog project first.\n\nDiagnostic Information:\n${JSON.stringify(diagnosticInfo, null, 2)}`,
                    },
                ],
            };
        }
        // Format the response to be more readable
        const formattedFunnels = funnelInsights.map((funnel) => ({
            id: funnel.id,
            short_id: funnel.short_id,
            name: funnel.name || funnel.filters?.display || "Unnamed Funnel",
            description: funnel.description || "No description",
            created_at: funnel.created_at,
            updated_at: funnel.updated_at,
            insight_type: funnel.insight,
            filters_insight: funnel.filters?.insight,
            query_kind: funnel.query?.kind,
            steps: funnel.filters?.events || funnel.query?.series || [],
            conversion_rate: funnel.result?.conversion_rate,
            drop_off_rate: funnel.result?.drop_off_rate,
            url: funnel.url,
        }));
        console.log("=== FUNNEL DEBUGGING END ===");
        return {
            content: [
                {
                    type: "text",
                    text: `Found ${formattedFunnels.length} funnel insights:\n${JSON.stringify(formattedFunnels, null, 2)}`,
                },
            ],
        };
    }
    catch (error) {
        console.log("=== FUNNEL DEBUGGING ERROR ===");
        console.log("Error:", error);
        throw new Error(`Error fetching funnels: ${error instanceof Error ? error.message : String(error)}`);
    }
};
exports.getAllFunnelsHandler = getAllFunnelsHandler;
const tool = () => ({
    name: "get-all-funnels",
    description: `
        - List all funnel insights in a project.
        - Supports filtering by search terms and insight type.
        - Returns paginated results with funnel configurations and metadata.
        - Can be used to discover existing funnels for analysis.
        - Shows funnel name, description, steps, conversion rates, and drop-off rates.
        - If no funnels are found, make sure you have created funnel insights in your PostHog project first.
        - Includes detailed diagnostic information to help troubleshoot issues.
        - Uses multiple detection methods to find funnels with different structures.
        - If no funnels are found, returns all insights for debugging purposes.
        - Uses 5 different detection methods to find all possible funnels.
        - Provides detailed console logging for debugging.
        - Shows which detection methods found each funnel.
    `,
    schema,
    handler: exports.getAllFunnelsHandler,
});
exports.default = tool;
