"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActivityLogEntrySchema = exports.ListActivityLogSchema = void 0;
const zod_1 = require("zod");
exports.ListActivityLogSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    limit: zod_1.z.number().int().positive().optional().describe("Number of activity log entries to return (default: 100)"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of activity log entries to skip"),
    user_id: zod_1.z.number().int().positive().optional().describe("Filter by user ID"),
    activity: zod_1.z.string().optional().describe("Filter by activity type"),
    scope: zod_1.z.string().optional().describe("Filter by scope"),
    item_id: zod_1.z.string().optional().describe("Filter by item ID"),
    date_from: zod_1.z.string().optional().describe("Start date (ISO format)"),
    date_to: zod_1.z.string().optional().describe("End date (ISO format)"),
});
exports.GetActivityLogEntrySchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    logId: zod_1.z.string().describe("Activity log entry ID"),
});
