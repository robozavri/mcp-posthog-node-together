"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteGroupSchema = exports.UpdateGroupSchema = exports.CreateGroupSchema = exports.GetGroupSchema = exports.ListGroupsSchema = exports.GetGroupTypeSchema = exports.ListGroupTypesSchema = void 0;
const zod_1 = require("zod");
exports.ListGroupTypesSchema = zod_1.z.object({
    limit: zod_1.z.number().int().positive().optional().describe("Number of group types to return (default: 100)"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of group types to skip"),
});
exports.GetGroupTypeSchema = zod_1.z.object({
    groupTypeIndex: zod_1.z.number().int().nonnegative().describe("Group type index"),
});
exports.ListGroupsSchema = zod_1.z.object({
    groupTypeIndex: zod_1.z.number().int().nonnegative().default(0).describe("Group type index (default: 0)"),
    limit: zod_1.z.number().int().positive().optional().describe("Number of groups to return (default: 100)"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of groups to skip"),
    search: zod_1.z.string().optional().describe("Search term for group name or key"),
    group_key: zod_1.z.string().optional().describe("Filter by specific group key"),
});
exports.GetGroupSchema = zod_1.z.object({
    groupTypeIndex: zod_1.z.number().int().nonnegative().describe("Group type index"),
    groupKey: zod_1.z.string().describe("Group key"),
});
exports.CreateGroupSchema = zod_1.z.object({
    groupTypeIndex: zod_1.z.number().int().nonnegative().describe("Group type index"),
    group_key: zod_1.z.string().describe("Group key"),
    group_properties: zod_1.z.record(zod_1.z.any()).optional().describe("Group properties"),
    created_at: zod_1.z.string().optional().describe("Creation date (ISO format)"),
    updated_at: zod_1.z.string().optional().describe("Last update date (ISO format)"),
});
exports.UpdateGroupSchema = zod_1.z.object({
    groupTypeIndex: zod_1.z.number().int().nonnegative().describe("Group type index"),
    groupKey: zod_1.z.string().describe("Group key"),
    group_properties: zod_1.z.record(zod_1.z.any()).optional().describe("Group properties"),
});
exports.DeleteGroupSchema = zod_1.z.object({
    groupTypeIndex: zod_1.z.number().int().nonnegative().describe("Group type index"),
    groupKey: zod_1.z.string().describe("Group key"),
});
