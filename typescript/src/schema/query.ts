import { z } from "zod";

export const ExecuteQuerySchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	query: z.string().describe("SQL query to execute"),
	query_type: z.enum(["sql", "hogql"]).optional().describe("Query type (sql or hogql)"),
	refresh: z.boolean().optional().describe("Whether to refresh cached results"),
	client_query_id: z.string().optional().describe("Client query ID for tracking"),
});

export const GetQueryResultsSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	limit: z.number().int().positive().optional().describe("Number of results to return (default: 100)"),
	offset: z.number().int().nonnegative().optional().describe("Number of results to skip"),
	query_type: z.enum(["sql", "hogql"]).optional().describe("Filter by query type"),
	status: z.enum(["running", "completed", "failed"]).optional().describe("Filter by query status"),
});

export const GetQueryResultSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	queryId: z.string().describe("Query ID"),
});