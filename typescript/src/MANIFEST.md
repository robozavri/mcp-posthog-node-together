# PostHog MCP Server Manifest

## Overview

The PostHog MCP Server includes a comprehensive manifest file that describes its capabilities, tools, and configuration requirements. This manifest follows the Model Context Protocol (MCP) specification and provides detailed information about the server's functionality.

## Manifest Location

- **JSON Manifest**: `typescript/src/manifest.json`
- **TypeScript Types**: `typescript/src/types/manifest.ts`
- **Utility Functions**: `typescript/src/utils/manifest.ts`

## Accessing the Manifest

### 1. HTTP Endpoint
The manifest is available via HTTP at:
```
GET /manifest
```

### 2. Programmatic Access
```typescript
import { getManifest, getManifestAsJSON } from "@/utils/manifest";

// Get manifest object
const manifest = getManifest();

// Get manifest as JSON string
const manifestJSON = getManifestAsJSON();
```

## Manifest Structure

### Basic Information
```json
{
  "name": "PostHog MCP Server",
  "version": "1.0.0",
  "description": "Model Context Protocol server for PostHog analytics and user behavior analysis",
  "author": "PostHog MCP Team",
  "license": "MIT"
}
```

### Capabilities
The manifest describes all available tools:

1. **get-active-users** - Retrieve daily or weekly active users
2. **get-retention** - Analyze user retention patterns
3. **get-page-views** - Comprehensive page view statistics
4. **get-detailed-page-views** - Advanced page analytics with bounce rate
5. **get-user-behavior** - User behavior analytics and engagement metrics

### Configuration
```json
{
  "configuration": {
    "required": {
      "apiToken": {
        "type": "string",
        "description": "PostHog API token for authentication"
      }
    },
    "optional": {
      "projectId": {
        "type": "string",
        "description": "PostHog project ID (will be auto-detected if not provided)"
      },
      "orgId": {
        "type": "string",
        "description": "PostHog organization ID (will be auto-detected if not provided)"
      }
    }
  }
}
```

## Tool Schemas

Each tool in the manifest includes a detailed input schema:

### Example: get-active-users
```json
{
  "name": "get-active-users",
  "description": "Retrieve daily or weekly active users from PostHog",
  "inputSchema": {
    "type": "object",
    "properties": {
      "interval": {
        "type": "string",
        "enum": ["daily", "weekly"],
        "description": "Time interval for active users (daily or weekly)"
      },
      "limit": {
        "type": "number",
        "default": 30,
        "description": "Number of results to return (default: 30)"
      }
    },
    "required": ["interval"]
  }
}
```

## Features

The manifest describes the server's capabilities:

### Analytics Features
- Active users tracking (daily/weekly)
- User retention analysis
- Page view statistics
- Detailed page analytics
- User behavior analysis

### Data Processing
- HogQL queries for efficient data retrieval
- Session analysis and bounce rate calculations
- User segmentation and behavioral insights
- Cohort analysis and retention tracking

### Time Periods
- Predefined periods: last_7_days, last_30_days, last_90_days, last_180_days, last_365_days
- Custom date ranges in YYYY-MM-DD format

### Filtering Options
- Path-based filtering for specific URLs
- Event-specific retention analysis

### Pagination Support
- Limit control for result sets
- Offset support for pagination

## Examples

The manifest includes usage examples for each tool:

```json
{
  "examples": {
    "basic_active_users": {
      "tool": "get-active-users",
      "parameters": {
        "interval": "daily",
        "limit": 30
      },
      "description": "Get daily active users for the last 30 days"
    },
    "user_behavior_analysis": {
      "tool": "get-user-behavior",
      "parameters": {
        "period": "last_30_days",
        "limit": 50
      },
      "description": "Analyze user behavior patterns for the last 30 days"
    }
  }
}
```

## Utility Functions

The manifest utilities provide several helpful functions:

### Basic Functions
```typescript
import { 
  getManifest, 
  getManifestAsJSON, 
  getToolsSummary,
  getAvailableTools,
  hasTool,
  getToolDefinition 
} from "@/utils/manifest";

// Get complete manifest
const manifest = getManifest();

// Get tools summary
const tools = getToolsSummary();

// Check if tool exists
const hasActiveUsers = hasTool("get-active-users");

// Get tool definition
const toolDef = getToolDefinition("get-active-users");
```

### Validation
```typescript
import { validateManifest } from "@/utils/manifest";

const isValid = validateManifest(manifestObject);
```

### File Operations
```typescript
import { 
  loadManifestFromFile, 
  saveManifestToFile 
} from "@/utils/manifest";

// Load from file
const manifest = loadManifestFromFile("./manifest.json");

// Save to file
const saved = saveManifestToFile(manifest, "./custom-manifest.json");
```

## Integration with MCP Server

The manifest is automatically integrated with the MCP server:

```typescript
import { getServerInfo } from "@/utils/manifest";

const server = new McpServer({
  name: "PostHog MCP",
  version: "1.0.0",
  instructions: INSTRUCTIONS,
  capabilities: getServerInfo().capabilities, // Uses manifest capabilities
});
```

## Endpoints

The server provides the following endpoints:

- **GET /manifest** - Returns the complete manifest
- **GET /mcp/events** - SSE endpoint for MCP communication
- **POST /mcp/messages** - Message endpoint for MCP communication

## Dependencies

The manifest lists all required dependencies:

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.4.0",
    "zod": "^3.22.0",
    "express": "^4.18.0"
  }
}
```

## Development

The manifest includes development information:

```json
{
  "development": {
    "build": "npm run build",
    "start": "npm start",
    "test": "npm test"
  }
}
```

## Usage in MCP Clients

MCP clients can use the manifest to:

1. **Discover Available Tools** - See what tools are available
2. **Understand Parameters** - Know what parameters each tool accepts
3. **Validate Input** - Use the schemas for input validation
4. **Generate Documentation** - Create user-facing documentation
5. **Build UIs** - Generate forms and interfaces

## Example Client Usage

```typescript
// Fetch manifest from server
const response = await fetch('http://localhost:3000/manifest');
const manifest = await response.json();

// Get available tools
const tools = manifest.capabilities.tools.tools;

// Find specific tool
const activeUsersTool = tools.find(t => t.name === 'get-active-users');

// Use tool schema for validation
const schema = activeUsersTool.inputSchema;
```

## Best Practices

1. **Always Check the Manifest** - Before using any tool, verify it exists in the manifest
2. **Validate Parameters** - Use the input schemas to validate parameters
3. **Handle Errors Gracefully** - Tools may not always be available
4. **Cache the Manifest** - Fetch once and cache for performance
5. **Check Versions** - Ensure client and server versions are compatible

## Troubleshooting

### Common Issues

1. **Manifest Not Found**
   - Ensure the server is running
   - Check the endpoint URL
   - Verify CORS settings

2. **Tool Not Available**
   - Check the manifest for available tools
   - Verify tool names match exactly
   - Check server version compatibility

3. **Parameter Validation Errors**
   - Use the input schemas from the manifest
   - Check required vs optional parameters
   - Verify parameter types and formats

### Debugging

```typescript
import { getAvailableTools, getToolDefinition } from "@/utils/manifest";

// List all available tools
console.log('Available tools:', getAvailableTools());

// Get detailed tool information
const toolInfo = getToolDefinition('get-active-users');
console.log('Tool info:', toolInfo);
```

## Contributing

When adding new tools to the server:

1. **Update the Manifest** - Add tool definition to `manifest.json`
2. **Update Types** - Add TypeScript interfaces in `types/manifest.ts`
3. **Update Utilities** - Add any necessary utility functions
4. **Test the Build** - Ensure everything compiles correctly
5. **Update Documentation** - Document the new tool

## Security Considerations

- The manifest is publicly accessible
- No sensitive information is included
- API tokens are not exposed in the manifest
- Tool schemas are safe to share publicly 