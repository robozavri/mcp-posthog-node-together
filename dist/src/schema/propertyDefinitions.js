"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePropertyDefinitionSchema = exports.UpdatePropertyDefinitionSchema = exports.CreatePropertyDefinitionSchema = exports.GetPropertyDefinitionSchema = exports.ListPropertyDefinitionsSchema = void 0;
const zod_1 = require("zod");
exports.ListPropertyDefinitionsSchema = zod_1.z.object({
    limit: zod_1.z.number().int().positive().optional().describe("Number of property definitions to return (default: 100)"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of property definitions to skip"),
    search: zod_1.z.string().optional().describe("Search term for property name or key"),
    property_type: zod_1.z.enum(["event", "person", "group"]).optional().describe("Filter by property type"),
    group_type_index: zod_1.z.number().int().nonnegative().optional().describe("Group type index for group properties"),
});
exports.GetPropertyDefinitionSchema = zod_1.z.object({
    propertyKey: zod_1.z.string().describe("Property key"),
});
exports.CreatePropertyDefinitionSchema = zod_1.z.object({
    name: zod_1.z.string().describe("Property name"),
    property_type: zod_1.z.enum(["event", "person", "group"]).describe("Property type"),
    description: zod_1.z.string().optional().describe("Property description"),
    group_type_index: zod_1.z.number().int().nonnegative().optional().describe("Group type index for group properties"),
    property_type_format: zod_1.z.string().optional().describe("Property type format"),
    example: zod_1.z.string().optional().describe("Example value"),
    property_type_definition: zod_1.z.record(zod_1.z.any()).optional().describe("Property type definition"),
    is_numerical: zod_1.z.boolean().optional().describe("Whether property is numerical"),
    is_seen_on_filtered_events: zod_1.z.boolean().optional().describe("Whether property is seen on filtered events"),
    query_usage_30_day: zod_1.z.number().int().nonnegative().optional().describe("Query usage in last 30 days"),
    volume_30_day: zod_1.z.number().int().nonnegative().optional().describe("Volume in last 30 days"),
});
exports.UpdatePropertyDefinitionSchema = zod_1.z.object({
    propertyKey: zod_1.z.string().describe("Property key"),
    name: zod_1.z.string().optional().describe("Property name"),
    description: zod_1.z.string().optional().describe("Property description"),
    property_type_format: zod_1.z.string().optional().describe("Property type format"),
    example: zod_1.z.string().optional().describe("Example value"),
    property_type_definition: zod_1.z.record(zod_1.z.any()).optional().describe("Property type definition"),
    is_numerical: zod_1.z.boolean().optional().describe("Whether property is numerical"),
    is_seen_on_filtered_events: zod_1.z.boolean().optional().describe("Whether property is seen on filtered events"),
});
exports.DeletePropertyDefinitionSchema = zod_1.z.object({
    propertyKey: zod_1.z.string().describe("Property key"),
});
