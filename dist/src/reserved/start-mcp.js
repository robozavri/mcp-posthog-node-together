"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const node_crypto_1 = __importDefault(require("node:crypto"));
const mcp_server_1 = require("../mcp-server"); // your file
const node_crypto_2 = require("node:crypto");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const transports = {};
// helper to build an MCP instance for this request
function buildMcp(req) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
        throw new Error("Missing Bearer token");
    const userHash = node_crypto_1.default.createHash("sha256").update(token).digest("hex");
    const mcp = new mcp_server_1.MCP({ apiToken: token, userHash });
    // Important: init registers tools ONCE per server
    //   if (!mcp.serverHasBeenInited) {
    //     // add a tiny flag to avoid double init if you reuse instance
    //     // or just always call init(), it's idempotent if you guard inside
    //     // See optional tweak below
    //   }
    return mcp;
}
// MCP command stream (Claude/OpenAI POST here)
app.post("/sse", async (req, res) => {
    // Check for existing session ID
    const sessionId = req.headers['mcp-session-id'];
    console.log(`POST Handling session: `, sessionId);
    let transport;
    if (sessionId && transports[sessionId]) {
        // Reuse existing transport
        transport = transports[sessionId];
    }
    else if (!sessionId && (0, types_js_1.isInitializeRequest)(req.body)) {
        try {
            const mcp = buildMcp(req);
            await mcp.init();
            const session = (0, node_crypto_2.randomUUID)();
            console.log("Received new initialization request session: ", session);
            transport = new streamableHttp_js_1.StreamableHTTPServerTransport({
                sessionIdGenerator: () => session,
                onsessioninitialized: (sessionId) => {
                    // Store the transport by session ID
                    transports[sessionId] = transport;
                },
                // DNS rebinding protection is disabled by default for backwards compatibility. If you are running this server
                // locally, make sure to set:
                // enableDnsRebindingProtection: true,
                // allowedHosts: ['127.0.0.1'],
            });
            await mcp.server.connect(transport);
            transport.onclose = () => {
                if (transport.sessionId) {
                    delete transports[transport.sessionId];
                }
            };
            await transport.handleRequest(req, res, mcp.server);
        }
        catch (err) {
            res.status(500).send(err?.message ?? "Internal error");
        }
    }
    else {
        // Invalid request
        res.status(400).json({
            jsonrpc: '2.0',
            error: {
                code: -32000,
                message: 'Bad Request: No valid session ID provided',
            },
            id: null,
        });
        return;
    }
});
const handleSessionRequest = async (req, res) => {
    const sessionId = req.headers['mcp-session-id'];
    if (!sessionId || !transports[sessionId]) {
        res.status(400).send('Invalid or missing session ID');
        return;
    }
    try {
        const transport = transports[sessionId];
        await transport.handleRequest(req, res);
    }
    catch (err) {
        res.status(500).send(err?.message ?? "Internal error");
    }
    // await transport.handleRequest(req, res, mcp.server);
    //   try {
    //     const mcp = buildMcp(req);
    //     await mcp.init();
    //     await transport.handleRequest(req, res, mcp.server);
    //   } catch (err: any) {
    //     res.status(500).send(err?.message ?? "Internal error");
    //   }
};
// SSE stream endpoint (Claude/OpenAI GET here)
app.get("/sse", handleSessionRequest);
app.get("/healthz", (_req, res) => res.send("ok"));
// Handle DELETE requests for session termination
app.delete('/mcp', handleSessionRequest);
app.listen(3000, () => {
    console.log("MCP server on http://localhost:3000");
});
