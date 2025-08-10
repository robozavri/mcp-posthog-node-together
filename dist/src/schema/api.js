"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseSchema = exports.ApiPropertyDefinitionSchema = void 0;
const zod_1 = require("zod");
exports.ApiPropertyDefinitionSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().nullable(),
    is_numerical: zod_1.z.boolean().nullable(),
    updated_at: zod_1.z.string().nullable(),
    updated_by: zod_1.z.string().nullable(),
    is_seen_on_filtered_events: zod_1.z.boolean().nullable(),
    property_type: zod_1.z.enum(["String", "Numeric", "Boolean", "DateTime"]).nullable(),
    verified: zod_1.z.boolean().nullable(),
    verified_at: zod_1.z.string().nullable(),
    verified_by: zod_1.z.string().nullable(),
    hidden: zod_1.z.boolean().nullable(),
    tags: zod_1.z.array(zod_1.z.string()),
});
const ApiResponseSchema = (dataSchema) => zod_1.z.object({
    count: zod_1.z.number(),
    next: zod_1.z.string().nullable(),
    previous: zod_1.z.string().nullable(),
    results: zod_1.z.array(dataSchema),
});
exports.ApiResponseSchema = ApiResponseSchema;
