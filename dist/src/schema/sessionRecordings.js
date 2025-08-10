"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshSessionRecordingSharingSchema = exports.GetSessionRecordingSharingSchema = exports.DeleteSessionRecordingSchema = exports.UpdateSessionRecordingSchema = exports.GetSessionRecordingSchema = exports.ListSessionRecordingsSchema = void 0;
const zod_1 = require("zod");
exports.ListSessionRecordingsSchema = zod_1.z.object({
    limit: zod_1.z.number().int().positive().optional().describe("Number of recordings to return (default: 100)"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of recordings to skip"),
    person_id: zod_1.z.string().optional().describe("Filter by person ID"),
    distinct_id: zod_1.z.string().optional().describe("Filter by distinct ID"),
    date_from: zod_1.z.string().optional().describe("Filter from date (ISO format)"),
    date_to: zod_1.z.string().optional().describe("Filter to date (ISO format)"),
    search: zod_1.z.string().optional().describe("Search term"),
    status: zod_1.z.enum(["active", "archived"]).optional().describe("Filter by status"),
});
exports.GetSessionRecordingSchema = zod_1.z.object({
    recordingId: zod_1.z.string().describe("Session recording ID"),
});
exports.UpdateSessionRecordingSchema = zod_1.z.object({
    recordingId: zod_1.z.string().describe("Session recording ID"),
    bookmarked: zod_1.z.boolean().optional().describe("Whether recording is bookmarked"),
    notes: zod_1.z.string().optional().describe("Recording notes"),
    status: zod_1.z.enum(["active", "archived"]).optional().describe("Recording status"),
});
exports.DeleteSessionRecordingSchema = zod_1.z.object({
    recordingId: zod_1.z.string().describe("Session recording ID"),
});
exports.GetSessionRecordingSharingSchema = zod_1.z.object({
    recordingId: zod_1.z.string().describe("Session recording ID"),
});
exports.RefreshSessionRecordingSharingSchema = zod_1.z.object({
    recordingId: zod_1.z.string().describe("Session recording ID"),
});
