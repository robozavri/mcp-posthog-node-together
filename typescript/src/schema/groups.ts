import { z } from "zod";

export const ListGroupTypesSchema = z.object({
	limit: z.number().int().positive().optional().describe("Number of group types to return (default: 100)"),
	offset: z.number().int().nonnegative().optional().describe("Number of group types to skip"),
});

export const GetGroupTypeSchema = z.object({
	groupTypeIndex: z.number().int().nonnegative().describe("Group type index"),
});

export const ListGroupsSchema = z.object({
	groupTypeIndex: z.number().int().nonnegative().default(0).describe("Group type index (default: 0)"),
	limit: z.number().int().positive().optional().describe("Number of groups to return (default: 100)"),
	offset: z.number().int().nonnegative().optional().describe("Number of groups to skip"),
	search: z.string().optional().describe("Search term for group name or key"),
	group_key: z.string().optional().describe("Filter by specific group key"),
});

export const GetGroupSchema = z.object({
	groupTypeIndex: z.number().int().nonnegative().describe("Group type index"),
	groupKey: z.string().describe("Group key"),
});

export const CreateGroupSchema = z.object({
	groupTypeIndex: z.number().int().nonnegative().describe("Group type index"),
	group_key: z.string().describe("Group key"),
	group_properties: z.record(z.any()).optional().describe("Group properties"),
	created_at: z.string().optional().describe("Creation date (ISO format)"),
	updated_at: z.string().optional().describe("Last update date (ISO format)"),
});

export const UpdateGroupSchema = z.object({
	groupTypeIndex: z.number().int().nonnegative().describe("Group type index"),
	groupKey: z.string().describe("Group key"),
	group_properties: z.record(z.any()).optional().describe("Group properties"),
});

export const DeleteGroupSchema = z.object({
	groupTypeIndex: z.number().int().nonnegative().describe("Group type index"),
	groupKey: z.string().describe("Group key"),
}); 