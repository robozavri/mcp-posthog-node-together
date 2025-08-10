import { z } from "zod";

export const ListSessionRecordingsSchema = z.object({
	limit: z.number().int().positive().optional().describe("Number of recordings to return (default: 100)"),
	offset: z.number().int().nonnegative().optional().describe("Number of recordings to skip"),
	person_id: z.string().optional().describe("Filter by person ID"),
	distinct_id: z.string().optional().describe("Filter by distinct ID"),
	date_from: z.string().optional().describe("Filter from date (ISO format)"),
	date_to: z.string().optional().describe("Filter to date (ISO format)"),
	search: z.string().optional().describe("Search term"),
	status: z.enum(["active", "archived"]).optional().describe("Filter by status"),
});

export const GetSessionRecordingSchema = z.object({
	recordingId: z.string().describe("Session recording ID"),
});

export const UpdateSessionRecordingSchema = z.object({
	recordingId: z.string().describe("Session recording ID"),
	bookmarked: z.boolean().optional().describe("Whether recording is bookmarked"),
	notes: z.string().optional().describe("Recording notes"),
	status: z.enum(["active", "archived"]).optional().describe("Recording status"),
});

export const DeleteSessionRecordingSchema = z.object({
	recordingId: z.string().describe("Session recording ID"),
});

export const GetSessionRecordingSharingSchema = z.object({
	recordingId: z.string().describe("Session recording ID"),
});

export const RefreshSessionRecordingSharingSchema = z.object({
	recordingId: z.string().describe("Session recording ID"),
}); 