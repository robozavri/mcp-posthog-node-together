"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLLMCostsHandler = void 0;
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.LLMObservabilityGetCostsSchema;
const getLLMCostsHandler = async (context, params) => {
    const { projectId, days } = params;
    const trendsQuery = {
        kind: "TrendsQuery",
        dateRange: {
            date_from: `-${days || 6}d`,
            date_to: null,
        },
        filterTestAccounts: true,
        series: [
            {
                event: "$ai_generation",
                name: "$ai_generation",
                math: "sum",
                math_property: "$ai_total_cost_usd",
                kind: "EventsNode",
            },
        ],
        breakdownFilter: {
            breakdown_type: "event",
            breakdown: "$ai_model",
        },
    };
    const costsResult = await context.api.query({ projectId: projectId.toString() }).execute({ queryBody: trendsQuery });
    if (!costsResult.success) {
        throw new Error(`Failed to get LLM costs: ${costsResult.error.message}`);
    }
    return {
        content: [{ type: "text", text: JSON.stringify(costsResult.data.results) }],
    };
};
exports.getLLMCostsHandler = getLLMCostsHandler;
const tool = () => ({
    name: "get-llm-total-costs-for-project",
    description: `
        - Fetches the total LLM daily costs for each model for a project over a given number of days.
        - If no number of days is provided, it defaults to 7.
        - The results are sorted by model name.
        - The total cost is rounded to 4 decimal places.
        - The query is executed against the project's data warehouse.
        - Show the results as a Markdown formatted table with the following information for each model:
            - Model name
            - Total cost in USD
            - Each day's date
            - Each day's cost in USD
        - Write in bold the model name with the highest total cost.
        - Properly render the markdown table in the response.
    `,
    schema,
    handler: exports.getLLMCostsHandler,
});
exports.default = tool;
