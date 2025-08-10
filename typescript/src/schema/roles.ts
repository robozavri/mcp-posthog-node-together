import { z } from "zod";

export const ListRolesSchema = z.object({
	organizationId: z.string().uuid().describe("Organization ID"),
	limit: z.number().int().positive().optional().describe("Number of roles to return (default: 100)"),
	offset: z.number().int().nonnegative().optional().describe("Number of roles to skip"),
});

export const GetRoleSchema = z.object({
	organizationId: z.string().uuid().describe("Organization ID"),
	roleId: z.number().int().positive().describe("Role ID"),
});

export const CreateRoleSchema = z.object({
	organizationId: z.string().uuid().describe("Organization ID"),
	name: z.string().describe("Role name"),
	description: z.string().optional().describe("Role description"),
	feature_flags_access_level: z.enum(["none", "read", "write"]).optional().describe("Feature flags access level"),
	cohorts_access_level: z.enum(["none", "read", "write"]).optional().describe("Cohorts access level"),
	data_management_access_level: z.enum(["none", "read", "write"]).optional().describe("Data management access level"),
	experiments_access_level: z.enum(["none", "read", "write"]).optional().describe("Experiments access level"),
	insights_access_level: z.enum(["none", "read", "write"]).optional().describe("Insights access level"),
	recordings_access_level: z.enum(["none", "read", "write"]).optional().describe("Recordings access level"),
	surveys_access_level: z.enum(["none", "read", "write"]).optional().describe("Surveys access level"),
	feature_flags: z.array(z.string()).optional().describe("Specific feature flags access"),
	cohorts: z.array(z.number()).optional().describe("Specific cohorts access"),
	experiments: z.array(z.number()).optional().describe("Specific experiments access"),
	insights: z.array(z.number()).optional().describe("Specific insights access"),
	recordings: z.array(z.string()).optional().describe("Specific recordings access"),
	surveys: z.array(z.number()).optional().describe("Specific surveys access"),
});

export const UpdateRoleSchema = z.object({
	organizationId: z.string().uuid().describe("Organization ID"),
	roleId: z.number().int().positive().describe("Role ID"),
	name: z.string().optional().describe("Role name"),
	description: z.string().optional().describe("Role description"),
	feature_flags_access_level: z.enum(["none", "read", "write"]).optional().describe("Feature flags access level"),
	cohorts_access_level: z.enum(["none", "read", "write"]).optional().describe("Cohorts access level"),
	data_management_access_level: z.enum(["none", "read", "write"]).optional().describe("Data management access level"),
	experiments_access_level: z.enum(["none", "read", "write"]).optional().describe("Experiments access level"),
	insights_access_level: z.enum(["none", "read", "write"]).optional().describe("Insights access level"),
	recordings_access_level: z.enum(["none", "read", "write"]).optional().describe("Recordings access level"),
	surveys_access_level: z.enum(["none", "read", "write"]).optional().describe("Surveys access level"),
	feature_flags: z.array(z.string()).optional().describe("Specific feature flags access"),
	cohorts: z.array(z.number()).optional().describe("Specific cohorts access"),
	experiments: z.array(z.number()).optional().describe("Specific experiments access"),
	insights: z.array(z.number()).optional().describe("Specific insights access"),
	recordings: z.array(z.string()).optional().describe("Specific recordings access"),
	surveys: z.array(z.number()).optional().describe("Specific surveys access"),
});

export const DeleteRoleSchema = z.object({
	organizationId: z.string().uuid().describe("Organization ID"),
	roleId: z.number().int().positive().describe("Role ID"),
}); 