"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeFunnelQueryHandler = void 0;
const zod_1 = require("zod");
const api_1 = require("@/lib/utils/api");
// Schema for funnel query execution
const FunnelQuerySchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    query: zod_1.z.string().describe("SQL or HogQL query for funnel analysis"),
    query_type: zod_1.z.enum(["sql", "hogql"]).optional().default("hogql").describe("Query type (sql or hogql)"),
    refresh: zod_1.z.boolean().optional().describe("Whether to refresh cached results"),
    client_query_id: zod_1.z.string().optional().describe("Client query ID for tracking"),
});
const schema = zod_1.z.object({
    data: FunnelQuerySchema,
});
const executeFunnelQueryHandler = async (context, params) => {
    const { data } = params;
    const payload = {
        query: data.query,
        query_type: data.query_type,
        refresh: data.refresh,
        client_query_id: data.client_query_id,
    };
    const url = `${(0, api_1.getProjectBaseUrl)(String(data.projectId))}/query/`;
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
        throw new Error(`Failed to execute funnel query: ${response.status} ${errorText}`);
    }
    const result = await response.json();
    return {
        content: [
            {
                type: "text",
                text: `Funnel Query Results:\n${JSON.stringify(result, null, 2)}`,
            },
        ],
    };
};
exports.executeFunnelQueryHandler = executeFunnelQueryHandler;
const tool = () => ({
    name: "execute-funnel-query",
    description: `
        - Execute SQL or HogQL queries for funnel analysis.
        - Useful for custom funnel calculations and complex funnel logic.
        - Can be used to create funnel insights that go beyond the standard funnel UI.
        - Supports both SQL and HogQL query types.
        - Example HogQL query for funnel analysis:
          SELECT 
            event,
            count() as count,
            count() / lag(count()) OVER (ORDER BY step_order) as conversion_rate
          FROM events 
          WHERE event IN ('page_view', 'sign_up', 'purchase')
          GROUP BY event, step_order
          ORDER BY step_order
    `,
    schema,
    handler: exports.executeFunnelQueryHandler,
});
exports.default = tool;
