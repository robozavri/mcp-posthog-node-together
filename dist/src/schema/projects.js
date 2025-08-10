"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectSchema = void 0;
const zod_1 = require("zod");
exports.ProjectSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
    name: zod_1.z.string(),
});
