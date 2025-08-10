"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunnelHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.FunnelGetSchema;
const getFunnelHandler = async (context, params) => {
    const { projectId, insightId } = params;
    const url = `${(0, api_1.getProjectBaseUrl)(String(projectId))}/insights/${insightId}/`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${context.apiToken}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to get funnel: ${response.status} ${errorText}`);
        }
        const result = await response.json();
        // Verify this is actually a funnel insight
        const isFunnel = result.filters?.insight === "funnels" ||
            result.insight === "funnels" ||
            result.query?.kind === "FunnelQuery" ||
            result.query?.insight === "funnels";
        if (!isFunnel) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Insight with ID ${insightId} is not a funnel insight. It appears to be a different type of insight.`,
                    },
                ],
            };
        }
        // Format the funnel data for better readability
        const formattedFunnel = {
            id: result.id,
            name: result.name || result.filters?.display || "Unnamed Funnel",
            description: result.description || "No description",
            created_at: result.created_at,
            updated_at: result.updated_at,
            steps: result.filters?.events || result.query?.series || [],
            step_order: result.filters?.step_order || "sequential",
            conversion_rate_calculation: result.filters?.conversion_rate_calculation || "overall",
            breakdown_by: result.filters?.breakdown_by,
            exclusion_steps: result.filters?.exclusion_steps || [],
            global_filters: result.filters?.properties || [],
            graph_type: result.filters?.graph_type || "conversion_steps",
            first_occurrence: result.filters?.first_occurrence || "first_occurrence_matching_filters",
            results: result.result || {},
            url: result.url,
        };
        return {
            content: [
                {
                    type: "text",
                    text: `Funnel Insight Details:\n${JSON.stringify(formattedFunnel, null, 2)}`,
                },
            ],
        };
    }
    catch (error) {
        throw new Error(`Error fetching funnel: ${error instanceof Error ? error.message : String(error)}`);
    }
};
exports.getFunnelHandler = getFunnelHandler;
const tool = () => ({
    name: "get-funnel",
    description: `
        - Get a specific funnel insight by ID.
        - Returns detailed information about the funnel including steps, conversion rates, and configuration.
        - Includes funnel results and metadata.
        - Shows step order, conversion rate calculation method, breakdown settings, and exclusion steps.
    `,
    schema,
    handler: exports.getFunnelHandler,
});
exports.default = tool;
