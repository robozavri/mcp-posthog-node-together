"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureFlagSchema = exports.UpdateFeatureFlagInputSchema = exports.CreateFeatureFlagInputSchema = exports.FilterGroupsSchema = exports.FiltersSchema = exports.PersonPropertyFilterSchema = void 0;
const zod_1 = require("zod");
const base = ["exact", "is_not"];
const stringOps = [
    ...base,
    "icontains",
    "not_icontains",
    "regex",
    "not_regex",
    "is_cleaned_path_exact",
];
const numberOps = [...base, "gt", "gte", "lt", "lte", "min", "max"];
const booleanOps = [...base];
const arrayOps = ["in", "not_in"];
const operatorSchema = zod_1.z.enum([
    ...stringOps,
    ...numberOps,
    ...booleanOps,
    ...arrayOps,
]);
exports.PersonPropertyFilterSchema = zod_1.z
    .object({
    key: zod_1.z.string(),
    value: zod_1.z.union([
        zod_1.z.string(),
        zod_1.z.number(),
        zod_1.z.boolean(),
        zod_1.z.array(zod_1.z.string()),
        zod_1.z.array(zod_1.z.number()),
    ]),
    operator: operatorSchema.optional(),
})
    .superRefine((data, ctx) => {
    const { value, operator } = data;
    if (!operator)
        return;
    const isArray = Array.isArray(value);
    const valid = (typeof value === "string" && stringOps.includes(operator)) ||
        (typeof value === "number" && numberOps.includes(operator)) ||
        (typeof value === "boolean" && booleanOps.includes(operator)) ||
        (isArray && arrayOps.includes(operator));
    if (!valid)
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: `operator "${operator}" is not valid for value type "${isArray ? "array" : typeof value}"`,
        });
    if (!isArray && arrayOps.includes(operator))
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: `operator "${operator}" requires an array value`,
        });
})
    .transform((data) => {
    return {
        ...data,
        type: "person",
    };
});
exports.FiltersSchema = zod_1.z.object({
    properties: zod_1.z.array(exports.PersonPropertyFilterSchema),
    rollout_percentage: zod_1.z.number(),
});
exports.FilterGroupsSchema = zod_1.z.object({
    groups: zod_1.z.array(exports.FiltersSchema),
});
exports.CreateFeatureFlagInputSchema = zod_1.z.object({
    name: zod_1.z.string(),
    key: zod_1.z.string(),
    description: zod_1.z.string(),
    filters: exports.FilterGroupsSchema,
    active: zod_1.z.boolean(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.UpdateFeatureFlagInputSchema = exports.CreateFeatureFlagInputSchema.omit({
    key: true,
}).partial();
exports.FeatureFlagSchema = zod_1.z.object({
    id: zod_1.z.number(),
    key: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    filters: exports.FiltersSchema.optional(),
    active: zod_1.z.boolean(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
