import { z } from "zod";

export const ListSessionRecordingPlaylistsSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	limit: z.number().int().positive().optional().describe("Number of playlists to return (default: 100)"),
	offset: z.number().int().nonnegative().optional().describe("Number of playlists to skip"),
});

export const GetSessionRecordingPlaylistSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	playlistId: z.string().describe("Session Recording Playlist ID"),
});

export const CreateSessionRecordingPlaylistSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	name: z.string().describe("Playlist name"),
	description: z.string().optional().describe("Playlist description"),
	filters: z.record(z.any()).optional().describe("Playlist filters"),
	derived_name: z.string().optional().describe("Derived name for the playlist"),
	short_id: z.string().optional().describe("Short ID for the playlist"),
});

export const UpdateSessionRecordingPlaylistSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	playlistId: z.string().describe("Session Recording Playlist ID"),
	name: z.string().optional().describe("Playlist name"),
	description: z.string().optional().describe("Playlist description"),
	filters: z.record(z.any()).optional().describe("Playlist filters"),
	derived_name: z.string().optional().describe("Derived name for the playlist"),
	short_id: z.string().optional().describe("Short ID for the playlist"),
});

export const DeleteSessionRecordingPlaylistSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	playlistId: z.string().describe("Session Recording Playlist ID"),
}); 