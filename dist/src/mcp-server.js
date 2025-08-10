"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCP = void 0;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const client_1 = require("@/api/client");
const client_2 = require("@/lib/client");
const DurableObjectCache_1 = require("@/lib/utils/cache/DurableObjectCache");
// import { handleToolError } from "@/lib/utils/handleToolError";
// import { hash } from "@/lib/utils/helper-functions";
const tools_1 = __importDefault(require("@/tools"));
const manifest_js_1 = require("@/utils/manifest.js");
const express = require('express');
const app = express();
app.use(express.json());
const posthogApi_1 = require("./posthogApi");
class MapStorage {
    store = new Map();
    async get(k) {
        return this.store.get(k);
    }
    async put(k, v) {
        this.store.set(k, v);
    }
    async delete(k) {
        return this.store.delete(k);
    }
    async list({ prefix = "" } = {}) {
        const out = new Map();
        for (const [k, v] of this.store.entries()) {
            if (k.startsWith(prefix))
                out.set(k, v);
        }
        return out;
    }
}
const INSTRUCTIONS = `
- You are a helpful assistant that can query PostHog API.
- If some resource from another tool is not found, ask the user if they want to try finding it in another project.
- If you cannot answer the user's PostHog related request or question using other available tools in this MCP, use the 'docs-search' tool to provide information from the documentation to guide user how they can do it themselves - when doing so provide condensed instructions with links to sources.
`;
// type State = {
// 	projectId: string | undefined;
// 	orgId: string | undefined;
// 	distinctId: string | undefined;
// };
// Define our MCP agent with tools
// export class MyMCP extends McpAgent {
class MCP {
    serverHasBeenInited = false;
    props = {};
    constructor(props) {
        this.props = props;
    }
    server = new mcp_js_1.McpServer({
        name: "PostHog MCP",
        version: "1.0.0",
        instructions: INSTRUCTIONS,
        capabilities: (0, manifest_js_1.getServerInfo)().capabilities,
    });
    initialState = {
        projectId: undefined,
        orgId: undefined,
        distinctId: undefined,
    };
    _cache;
    get requestProperties() {
        return this.props;
    }
    get cache() {
        if (!this._cache) {
            const storage = new MapStorage();
            // this._cache = new DurableObjectCache<State>(this.requestProperties.userHash, storage);
            this._cache = new DurableObjectCache_1.DurableObjectCache(this.requestProperties.userHash, storage);
        }
        return this._cache;
    }
    get api() {
        return new client_1.ApiClient({
            apiToken: this.requestProperties.apiToken,
        });
    }
    async getDistinctId() {
        let _distinctId = await this.cache.get("distinctId");
        if (!_distinctId) {
            const user = await (0, posthogApi_1.getUser)(this.requestProperties.apiToken);
            await this.cache.set("distinctId", user.distinctId);
            _distinctId = user.distinctId;
        }
        return _distinctId;
    }
    async trackEvent(event, properties = {}) {
        try {
            const distinctId = await this.getDistinctId();
            const client = (0, client_2.getPostHogClient)();
            client.capture({ distinctId, event, properties });
        }
        catch (error) {
            //
        }
    }
    registerTool(name, description, schema, handler) {
        const wrappedHandler = async (params) => {
            await this.trackEvent('mcp tool call', {
                tool: name,
            });
            return await handler(params);
        };
        this.server.tool(name, description, schema, wrappedHandler);
    }
    async getOrgID() {
        const orgId = await this.cache.get("orgId");
        if (!orgId) {
            const orgs = await (0, posthogApi_1.getOrganizations)(this.requestProperties.apiToken);
            // If there is only one org, set it as the active org
            if (orgs.length === 1) {
                await this.cache.set("orgId", orgs[0].id);
                return orgs[0].id;
            }
            return "@current";
        }
        return orgId;
    }
    async getProjectId() {
        const projectId = await this.cache.get("projectId");
        if (!projectId) {
            const orgId = await this.getOrgID();
            const projects = await (0, posthogApi_1.getProjects)(orgId, this.requestProperties.apiToken);
            // If there is only one project, set it as the active project
            if (projects.length === 1) {
                await this.cache.set("projectId", projects[0].id.toString());
                return projects[0].id.toString();
            }
            return "@current";
        }
        return projectId;
    }
    getContext() {
        return {
            api: this.api,
            cache: this.cache,
            apiToken: this.props.apiToken,
            getProjectId: this.getProjectId.bind(this),
            getOrgID: this.getOrgID.bind(this),
            getDistinctId: this.getDistinctId.bind(this),
        };
    }
    async init() {
        const context = this.getContext();
        const allTools = (0, tools_1.default)(context);
        for (const tool of allTools) {
            this.registerTool(tool.name, tool.description, tool.schema.shape, async (params) => tool.handler(context, params));
        }
    }
}
exports.MCP = MCP;
