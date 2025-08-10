"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPersonTrendsSchema = exports.GetPersonStickinessSchema = exports.GetPersonActivitySchema = exports.DeletePersonSchema = exports.UpdatePersonSchema = exports.CreatePersonSchema = exports.GetPersonSchema = exports.ListPersonsSchema = void 0;
const zod_1 = require("zod");
exports.ListPersonsSchema = zod_1.z.object({
    limit: zod_1.z.number().int().positive().optional().describe("Number of persons to return (default: 100)"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of persons to skip"),
    properties: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional().describe("Filter persons by properties"),
    cohort: zod_1.z.number().int().positive().optional().describe("Filter persons by cohort ID"),
    search: zod_1.z.string().optional().describe("Search persons by name or distinct_id"),
    format: zod_1.z.enum(["json", "csv"]).optional().describe("Response format"),
});
exports.GetPersonSchema = zod_1.z.object({
    personId: zod_1.z.string().describe("Person ID (distinct_id)"),
    format: zod_1.z.enum(["json", "csv"]).optional().describe("Response format"),
});
exports.CreatePersonSchema = zod_1.z.object({
    distinctId: zod_1.z.string().describe("Unique identifier for the person"),
    properties: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional().describe("Person properties"),
    $set: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional().describe("Set properties (alias for properties)"),
    $set_once: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional().describe("Set properties only if not already set"),
});
exports.UpdatePersonSchema = zod_1.z.object({
    personId: zod_1.z.string().describe("Person ID (distinct_id)"),
    properties: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).describe("Person properties to update"),
    $set: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional().describe("Set properties (alias for properties)"),
    $set_once: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional().describe("Set properties only if not already set"),
});
exports.DeletePersonSchema = zod_1.z.object({
    personId: zod_1.z.string().describe("Person ID (distinct_id)"),
});
exports.GetPersonActivitySchema = zod_1.z.object({
    personId: zod_1.z.string().describe("Person ID (distinct_id)"),
    limit: zod_1.z.number().int().positive().optional().describe("Number of events to return"),
    before: zod_1.z.string().optional().describe("Get events before this timestamp"),
    after: zod_1.z.string().optional().describe("Get events after this timestamp"),
});
exports.GetPersonStickinessSchema = zod_1.z.object({
    dateFrom: zod_1.z.string().optional().describe("Start date (e.g., -30d)"),
    interval: zod_1.z.enum(["day", "week", "month"]).optional().describe("Time interval"),
    properties: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional().describe("Filter by properties"),
});
exports.GetPersonTrendsSchema = zod_1.z.object({
    dateFrom: zod_1.z.string().optional().describe("Start date (e.g., -30d)"),
    interval: zod_1.z.enum(["day", "week", "month"]).optional().describe("Time interval"),
    filters: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional().describe("Additional filters"),
});
