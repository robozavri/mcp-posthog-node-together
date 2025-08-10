import { z } from "zod";

export const ListPropertyDefinitionsSchema = z.object({
	limit: z.number().int().positive().optional().describe("Number of property definitions to return (default: 100)"),
	offset: z.number().int().nonnegative().optional().describe("Number of property definitions to skip"),
	search: z.string().optional().describe("Search term for property name or key"),
	property_type: z.enum(["event", "person", "group"]).optional().describe("Filter by property type"),
	group_type_index: z.number().int().nonnegative().optional().describe("Group type index for group properties"),
});

export const GetPropertyDefinitionSchema = z.object({
	propertyKey: z.string().describe("Property key"),
});

export const CreatePropertyDefinitionSchema = z.object({
	name: z.string().describe("Property name"),
	property_type: z.enum(["event", "person", "group"]).describe("Property type"),
	description: z.string().optional().describe("Property description"),
	group_type_index: z.number().int().nonnegative().optional().describe("Group type index for group properties"),
	property_type_format: z.string().optional().describe("Property type format"),
	example: z.string().optional().describe("Example value"),
	property_type_definition: z.record(z.any()).optional().describe("Property type definition"),
	is_numerical: z.boolean().optional().describe("Whether property is numerical"),
	is_seen_on_filtered_events: z.boolean().optional().describe("Whether property is seen on filtered events"),
	query_usage_30_day: z.number().int().nonnegative().optional().describe("Query usage in last 30 days"),
	volume_30_day: z.number().int().nonnegative().optional().describe("Volume in last 30 days"),
});

export const UpdatePropertyDefinitionSchema = z.object({
	propertyKey: z.string().describe("Property key"),
	name: z.string().optional().describe("Property name"),
	description: z.string().optional().describe("Property description"),
	property_type_format: z.string().optional().describe("Property type format"),
	example: z.string().optional().describe("Example value"),
	property_type_definition: z.record(z.any()).optional().describe("Property type definition"),
	is_numerical: z.boolean().optional().describe("Whether property is numerical"),
	is_seen_on_filtered_events: z.boolean().optional().describe("Whether property is seen on filtered events"),
});

export const DeletePropertyDefinitionSchema = z.object({
	propertyKey: z.string().describe("Property key"),
}); 