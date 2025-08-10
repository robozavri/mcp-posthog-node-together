import { z } from "zod";

export const ListMembersSchema = z.object({
	organizationId: z.string().uuid().describe("Organization ID"),
	limit: z.number().int().positive().optional().describe("Number of members to return (default: 100)"),
	offset: z.number().int().nonnegative().optional().describe("Number of members to skip"),
});

export const GetMemberSchema = z.object({
	organizationId: z.string().uuid().describe("Organization ID"),
	userUuid: z.string().uuid().describe("User UUID"),
});

export const InviteMemberSchema = z.object({
	organizationId: z.string().uuid().describe("Organization ID"),
	email: z.string().email().describe("Member email address"),
	level: z.enum(["admin", "member"]).optional().describe("Member access level"),
	first_name: z.string().optional().describe("Member first name"),
	last_name: z.string().optional().describe("Member last name"),
});

export const UpdateMemberSchema = z.object({
	organizationId: z.string().uuid().describe("Organization ID"),
	userUuid: z.string().uuid().describe("User UUID"),
	level: z.enum(["admin", "member"]).optional().describe("Member access level"),
	first_name: z.string().optional().describe("Member first name"),
	last_name: z.string().optional().describe("Member last name"),
});

export const RemoveMemberSchema = z.object({
	organizationId: z.string().uuid().describe("Organization ID"),
	userUuid: z.string().uuid().describe("User UUID"),
}); 