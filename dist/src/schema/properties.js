"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyDefinitionSchema = void 0;
const api_1 = require("./api");
exports.PropertyDefinitionSchema = api_1.ApiPropertyDefinitionSchema.pick({
    name: true,
    property_type: true,
});
