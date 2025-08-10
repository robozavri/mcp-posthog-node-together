"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteSessionRecordingPlaylistSchema = exports.UpdateSessionRecordingPlaylistSchema = exports.CreateSessionRecordingPlaylistSchema = exports.GetSessionRecordingPlaylistSchema = exports.ListSessionRecordingPlaylistsSchema = void 0;
const zod_1 = require("zod");
exports.ListSessionRecordingPlaylistsSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    limit: zod_1.z.number().int().positive().optional().describe("Number of playlists to return (default: 100)"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of playlists to skip"),
});
exports.GetSessionRecordingPlaylistSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    playlistId: zod_1.z.string().describe("Session Recording Playlist ID"),
});
exports.CreateSessionRecordingPlaylistSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    name: zod_1.z.string().describe("Playlist name"),
    description: zod_1.z.string().optional().describe("Playlist description"),
    filters: zod_1.z.record(zod_1.z.any()).optional().describe("Playlist filters"),
    derived_name: zod_1.z.string().optional().describe("Derived name for the playlist"),
    short_id: zod_1.z.string().optional().describe("Short ID for the playlist"),
});
exports.UpdateSessionRecordingPlaylistSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    playlistId: zod_1.z.string().describe("Session Recording Playlist ID"),
    name: zod_1.z.string().optional().describe("Playlist name"),
    description: zod_1.z.string().optional().describe("Playlist description"),
    filters: zod_1.z.record(zod_1.z.any()).optional().describe("Playlist filters"),
    derived_name: zod_1.z.string().optional().describe("Derived name for the playlist"),
    short_id: zod_1.z.string().optional().describe("Short ID for the playlist"),
});
exports.DeleteSessionRecordingPlaylistSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    playlistId: zod_1.z.string().describe("Session Recording Playlist ID"),
});
