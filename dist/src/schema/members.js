"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveMemberSchema = exports.UpdateMemberSchema = exports.InviteMemberSchema = exports.GetMemberSchema = exports.ListMembersSchema = void 0;
const zod_1 = require("zod");
exports.ListMembersSchema = zod_1.z.object({
    organizationId: zod_1.z.string().uuid().describe("Organization ID"),
    limit: zod_1.z.number().int().positive().optional().describe("Number of members to return (default: 100)"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of members to skip"),
});
exports.GetMemberSchema = zod_1.z.object({
    organizationId: zod_1.z.string().uuid().describe("Organization ID"),
    userUuid: zod_1.z.string().uuid().describe("User UUID"),
});
exports.InviteMemberSchema = zod_1.z.object({
    organizationId: zod_1.z.string().uuid().describe("Organization ID"),
    email: zod_1.z.string().email().describe("Member email address"),
    level: zod_1.z.enum(["admin", "member"]).optional().describe("Member access level"),
    first_name: zod_1.z.string().optional().describe("Member first name"),
    last_name: zod_1.z.string().optional().describe("Member last name"),
});
exports.UpdateMemberSchema = zod_1.z.object({
    organizationId: zod_1.z.string().uuid().describe("Organization ID"),
    userUuid: zod_1.z.string().uuid().describe("User UUID"),
    level: zod_1.z.enum(["admin", "member"]).optional().describe("Member access level"),
    first_name: zod_1.z.string().optional().describe("Member first name"),
    last_name: zod_1.z.string().optional().describe("Member last name"),
});
exports.RemoveMemberSchema = zod_1.z.object({
    organizationId: zod_1.z.string().uuid().describe("Organization ID"),
    userUuid: zod_1.z.string().uuid().describe("User UUID"),
});
