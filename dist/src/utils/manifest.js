"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getManifest = getManifest;
exports.getManifestAsJSON = getManifestAsJSON;
exports.loadManifestFromFile = loadManifestFromFile;
exports.saveManifestToFile = saveManifestToFile;
exports.validateManifest = validateManifest;
exports.getManifestHandler = getManifestHandler;
exports.getServerInfo = getServerInfo;
exports.getToolsSummary = getToolsSummary;
exports.hasTool = hasTool;
exports.getToolDefinition = getToolDefinition;
exports.getAvailableTools = getAvailableTools;
const manifest_1 = require("@/types/manifest");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
/**
 * Utility functions for handling MCP manifest
 */
/**
 * Get the manifest for the PostHog MCP Server
 * @returns The complete manifest object
 */
function getManifest() {
    return manifest_1.DEFAULT_MANIFEST;
}
/**
 * Get the manifest as a JSON string
 * @returns The manifest as a formatted JSON string
 */
function getManifestAsJSON() {
    return JSON.stringify(manifest_1.DEFAULT_MANIFEST, null, 2);
}
/**
 * Load manifest from file (if exists)
 * @param filePath Path to the manifest file
 * @returns The manifest object or null if file doesn't exist
 */
function loadManifestFromFile(filePath) {
    try {
        const fullPath = node_path_1.default.resolve(filePath);
        if (node_fs_1.default.existsSync(fullPath)) {
            const manifestContent = node_fs_1.default.readFileSync(fullPath, 'utf8');
            return JSON.parse(manifestContent);
        }
        return null;
    }
    catch (error) {
        console.error('Error loading manifest from file:', error);
        return null;
    }
}
/**
 * Save manifest to file
 * @param manifest The manifest object to save
 * @param filePath Path where to save the manifest
 * @returns True if successful, false otherwise
 */
function saveManifestToFile(manifest, filePath) {
    try {
        const fullPath = node_path_1.default.resolve(filePath);
        const manifestContent = JSON.stringify(manifest, null, 2);
        node_fs_1.default.writeFileSync(fullPath, manifestContent, 'utf8');
        return true;
    }
    catch (error) {
        console.error('Error saving manifest to file:', error);
        return false;
    }
}
/**
 * Validate manifest structure
 * @param manifest The manifest object to validate
 * @returns True if valid, false otherwise
 */
function validateManifest(manifest) {
    try {
        // Basic structure validation
        const requiredFields = [
            'name', 'version', 'description', 'author', 'license',
            'repository', 'keywords', 'capabilities', 'configuration',
            'features', 'examples', 'endpoints', 'dependencies', 'development'
        ];
        for (const field of requiredFields) {
            if (!manifest[field]) {
                console.error(`Missing required field: ${field}`);
                return false;
            }
        }
        // Validate capabilities structure
        if (!manifest.capabilities.tools || !Array.isArray(manifest.capabilities.tools.tools)) {
            console.error('Invalid capabilities structure');
            return false;
        }
        // Validate tools
        for (const tool of manifest.capabilities.tools.tools) {
            if (!tool.name || !tool.description || !tool.inputSchema) {
                console.error('Invalid tool structure:', tool.name);
                return false;
            }
        }
        return true;
    }
    catch (error) {
        console.error('Error validating manifest:', error);
        return false;
    }
}
/**
 * Get manifest endpoint handler for Express
 * @returns Express middleware function
 */
function getManifestHandler() {
    return (req, res) => {
        try {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            if (req.method === 'OPTIONS') {
                res.status(200).end();
                return;
            }
            const manifest = getManifest();
            res.status(200).json(manifest);
        }
        catch (error) {
            console.error('Error serving manifest:', error);
            res.status(500).json({ error: 'Failed to serve manifest' });
        }
    };
}
/**
 * Get manifest information for MCP server initialization
 * @returns Object with server information from manifest
 */
function getServerInfo() {
    const manifest = getManifest();
    return {
        name: manifest.name,
        version: manifest.version,
        description: manifest.description,
        capabilities: manifest.capabilities
    };
}
/**
 * Generate a summary of available tools from manifest
 * @returns Array of tool summaries
 */
function getToolsSummary() {
    const manifest = getManifest();
    return manifest.capabilities.tools.tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        parameters: Object.keys(tool.inputSchema.properties || {}),
        required: tool.inputSchema.required || []
    }));
}
/**
 * Check if a tool exists in the manifest
 * @param toolName Name of the tool to check
 * @returns True if tool exists, false otherwise
 */
function hasTool(toolName) {
    const manifest = getManifest();
    return manifest.capabilities.tools.tools.some(tool => tool.name === toolName);
}
/**
 * Get tool definition from manifest
 * @param toolName Name of the tool to get
 * @returns Tool definition or null if not found
 */
function getToolDefinition(toolName) {
    const manifest = getManifest();
    return manifest.capabilities.tools.tools.find(tool => tool.name === toolName) || null;
}
/**
 * Get all available tool names
 * @returns Array of tool names
 */
function getAvailableTools() {
    const manifest = getManifest();
    return manifest.capabilities.tools.tools.map(tool => tool.name);
}
