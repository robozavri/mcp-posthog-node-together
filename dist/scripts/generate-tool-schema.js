#!/usr/bin/env tsx
"use strict";
// Generates JSON schema from Zod tool-inputs schemas for Python Pydantic schema generation
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const zod_to_json_schema_1 = require("zod-to-json-schema");
const schemas = __importStar(require("../src/schema/tool-inputs"));
const outputPath = path.join(__dirname, "../../schema/tool-inputs.json");
console.log("Generating JSON schema from Zod tool-inputs schemas...");
try {
    // Convert all Zod schemas to JSON Schema
    const jsonSchemas = {
        $schema: "http://json-schema.org/draft-07/schema#",
        definitions: {},
    };
    // Add each schema to the definitions
    for (const [schemaName, zodSchema] of Object.entries(schemas)) {
        if (schemaName.endsWith("Schema")) {
            console.log(`Converting ${schemaName}...`);
            const jsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(zodSchema, {
                name: schemaName,
                $refStrategy: "none",
            });
            // Remove the top-level $schema to avoid conflicts
            jsonSchema.$schema = undefined;
            // Extract the actual schema from nested definitions if present
            let actualSchema = jsonSchema;
            const schemaObj = jsonSchema;
            // If there's nested definitions with the schema name, use that
            if (schemaObj.definitions?.[schemaName]) {
                actualSchema = schemaObj.definitions[schemaName];
            }
            // If there's a $ref pointing to itself, and definitions exist, extract the definition
            else if (schemaObj.$ref?.includes(schemaName) && schemaObj.definitions) {
                actualSchema = schemaObj.definitions[schemaName] || schemaObj;
            }
            // Clean up any remaining $schema references
            if (actualSchema.$schema) {
                actualSchema.$schema = undefined;
            }
            jsonSchemas.definitions[schemaName] = actualSchema;
        }
    }
    // Write the combined schema
    const schemaString = JSON.stringify(jsonSchemas, null, 2);
    fs.writeFileSync(outputPath, schemaString);
    console.log(`✅ JSON schema generated successfully at: ${outputPath}`);
    console.log(`📋 Generated schemas for ${Object.keys(jsonSchemas.definitions).length} tool input types`);
}
catch (err) {
    console.error("❌ Error generating schema:", err);
    process.exit(1);
}
