"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteRoleSchema = exports.UpdateRoleSchema = exports.CreateRoleSchema = exports.GetRoleSchema = exports.ListRolesSchema = void 0;
const zod_1 = require("zod");
exports.ListRolesSchema = zod_1.z.object({
    organizationId: zod_1.z.string().uuid().describe("Organization ID"),
    limit: zod_1.z.number().int().positive().optional().describe("Number of roles to return (default: 100)"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of roles to skip"),
});
exports.GetRoleSchema = zod_1.z.object({
    organizationId: zod_1.z.string().uuid().describe("Organization ID"),
    roleId: zod_1.z.number().int().positive().describe("Role ID"),
});
exports.CreateRoleSchema = zod_1.z.object({
    organizationId: zod_1.z.string().uuid().describe("Organization ID"),
    name: zod_1.z.string().describe("Role name"),
    description: zod_1.z.string().optional().describe("Role description"),
    feature_flags_access_level: zod_1.z.enum(["none", "read", "write"]).optional().describe("Feature flags access level"),
    cohorts_access_level: zod_1.z.enum(["none", "read", "write"]).optional().describe("Cohorts access level"),
    data_management_access_level: zod_1.z.enum(["none", "read", "write"]).optional().describe("Data management access level"),
    experiments_access_level: zod_1.z.enum(["none", "read", "write"]).optional().describe("Experiments access level"),
    insights_access_level: zod_1.z.enum(["none", "read", "write"]).optional().describe("Insights access level"),
    recordings_access_level: zod_1.z.enum(["none", "read", "write"]).optional().describe("Recordings access level"),
    surveys_access_level: zod_1.z.enum(["none", "read", "write"]).optional().describe("Surveys access level"),
    feature_flags: zod_1.z.array(zod_1.z.string()).optional().describe("Specific feature flags access"),
    cohorts: zod_1.z.array(zod_1.z.number()).optional().describe("Specific cohorts access"),
    experiments: zod_1.z.array(zod_1.z.number()).optional().describe("Specific experiments access"),
    insights: zod_1.z.array(zod_1.z.number()).optional().describe("Specific insights access"),
    recordings: zod_1.z.array(zod_1.z.string()).optional().describe("Specific recordings access"),
    surveys: zod_1.z.array(zod_1.z.number()).optional().describe("Specific surveys access"),
});
exports.UpdateRoleSchema = zod_1.z.object({
    organizationId: zod_1.z.string().uuid().describe("Organization ID"),
    roleId: zod_1.z.number().int().positive().describe("Role ID"),
    name: zod_1.z.string().optional().describe("Role name"),
    description: zod_1.z.string().optional().describe("Role description"),
    feature_flags_access_level: zod_1.z.enum(["none", "read", "write"]).optional().describe("Feature flags access level"),
    cohorts_access_level: zod_1.z.enum(["none", "read", "write"]).optional().describe("Cohorts access level"),
    data_management_access_level: zod_1.z.enum(["none", "read", "write"]).optional().describe("Data management access level"),
    experiments_access_level: zod_1.z.enum(["none", "read", "write"]).optional().describe("Experiments access level"),
    insights_access_level: zod_1.z.enum(["none", "read", "write"]).optional().describe("Insights access level"),
    recordings_access_level: zod_1.z.enum(["none", "read", "write"]).optional().describe("Recordings access level"),
    surveys_access_level: zod_1.z.enum(["none", "read", "write"]).optional().describe("Surveys access level"),
    feature_flags: zod_1.z.array(zod_1.z.string()).optional().describe("Specific feature flags access"),
    cohorts: zod_1.z.array(zod_1.z.number()).optional().describe("Specific cohorts access"),
    experiments: zod_1.z.array(zod_1.z.number()).optional().describe("Specific experiments access"),
    insights: zod_1.z.array(zod_1.z.number()).optional().describe("Specific insights access"),
    recordings: zod_1.z.array(zod_1.z.string()).optional().describe("Specific recordings access"),
    surveys: zod_1.z.array(zod_1.z.number()).optional().describe("Specific surveys access"),
});
exports.DeleteRoleSchema = zod_1.z.object({
    organizationId: zod_1.z.string().uuid().describe("Organization ID"),
    roleId: zod_1.z.number().int().positive().describe("Role ID"),
});
