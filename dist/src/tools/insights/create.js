"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.InsightCreateSchema;
const createHandler = async (context, params) => {
    const { data } = params;
    const projectId = await context.getProjectId();
    const insightResult = await context.api.insights({ projectId }).create({ data });
    if (!insightResult.success) {
        throw new Error(`Failed to create insight: ${insightResult.error.message}`);
    }
    const insightWithUrl = {
        ...insightResult.data,
        url: `${(0, api_1.getProjectBaseUrl)(projectId)}/insights/${insightResult.data.short_id}`,
    };
    return { content: [{ type: "text", text: JSON.stringify(insightWithUrl) }] };
};
exports.createHandler = createHandler;
const tool = () => ({
    name: "insight-create-from-query",
    description: `
        - You can use this to save a query as an insight. You should only do this with a valid query that you have seen, or one you have modified slightly.
        - If the user wants to see data, you should use the "get-sql-insight" tool to get that data instead.
        - An insight requires a name, query, and other optional properties.
        - The query should use HogQL, which is a variant of Clickhouse SQL. Here is an example query:
        Here is an example of a valid query:
        {
            "kind": "DataVisualizationNode",
            "source": {
                "kind": "HogQLQuery",
                "query": "SELECT\\n  event,\\n  count() AS event_count\\nFROM\\n  events\\nWHERE\\n  timestamp >= now() - INTERVAL 7 day\\nGROUP BY\\n  event\\nORDER BY\\n  event_count DESC\\nLIMIT 10",
                "explain": true,
                "filters": {
                    "dateRange": {
                        "date_from": "-7d"
                    }
                }
            },
        }
    `,
    schema,
    handler: exports.createHandler,
});
exports.default = tool;
