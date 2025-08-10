"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetQueryResultSchema = exports.GetQueryResultsSchema = exports.ExecuteQuerySchema = void 0;
const zod_1 = require("zod");
exports.ExecuteQuerySchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    query: zod_1.z.string().describe("SQL query to execute"),
    query_type: zod_1.z.enum(["sql", "hogql"]).optional().describe("Query type (sql or hogql)"),
    refresh: zod_1.z.boolean().optional().describe("Whether to refresh cached results"),
    client_query_id: zod_1.z.string().optional().describe("Client query ID for tracking"),
});
exports.GetQueryResultsSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    limit: zod_1.z.number().int().positive().optional().describe("Number of results to return (default: 100)"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of results to skip"),
    query_type: zod_1.z.enum(["sql", "hogql"]).optional().describe("Filter by query type"),
    status: zod_1.z.enum(["running", "completed", "failed"]).optional().describe("Filter by query status"),
});
exports.GetQueryResultSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    queryId: zod_1.z.string().describe("Query ID"),
});
