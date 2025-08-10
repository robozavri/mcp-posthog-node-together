import "module-alias/register";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import http from "node:http";
import { URL } from "node:url"; // For parsing URL and query parameters
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js"
import crypto from "node:crypto";
import { MCP } from "./mcp-server"; // your file
import { randomUUID } from "node:crypto";
import { getManifestHandler } from "./utils/manifest.js";

/**
 * Main class for the MCP GA4 server
 */
async function main() {

    const SERVER_NAME = "mcp-server-ai-analytics";
    const SERVER_VERSION = "1.0.0";
    const PORT = process.env.PORT || 3000; // Your desired port
    const SSE_ENDPOINT = "/mcp/events";
    const MESSAGE_ENDPOINT_BASE = "/mcp/messages"; // Client will POST here
    const activeTransports: { [sessionId: string]: SSEServerTransport } = {};

    try {

        // Create an HTTP server
        const httpServer = http.createServer(async (req, res) => {
            console.log('req.headers: ', req.headers);
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                throw new Error("Missing Bearer token"); 
            }
            const userHash = crypto.createHash("sha256").update(token).digest("hex");

            const mcp = new MCP({ apiToken: token, userHash });
            await mcp.init();
            const server = mcp.server;

            console.log(`[HTTP] is listening on port ${PORT} for ${req.method} ${req.url}`);

            const requestUrl = new URL(req.url || "", `http://${req.headers.host}`);

            if (req.method === "GET" && requestUrl.pathname === "/manifest") {
                // Serve the MCP manifest
                const manifestHandler = getManifestHandler();
                manifestHandler(req, res);
            } else if (req.method === "GET" && requestUrl.pathname === SSE_ENDPOINT) {
                console.error(`[HTTP] SSE connection request to ${SSE_ENDPOINT}`);
                // The first argument to SSEServerTransport is the endpoint clients should POST to.
                const transport = new SSEServerTransport(MESSAGE_ENDPOINT_BASE, res);
                activeTransports[transport.sessionId] = transport;
                console.error(`[HTTP] SSE transport created with sessionId: ${transport.sessionId}. Client will be informed to POST to ${MESSAGE_ENDPOINT_BASE}`);

                res.on("close", () => {
                    console.error(`[HTTP] SSE connection closed for sessionId: ${transport.sessionId}`);
                    // The McpServer's protocol layer handles calling transport.close()
                    delete activeTransports[transport.sessionId];
                });

                try {
                    await server.connect(transport); // This also calls transport.start()
                    console.error(`[MCP] Server connected to new SSE transport: ${transport.sessionId}`);
                } catch (error) {
                    console.error(`[MCP] Error connecting server to SSE transport ${transport.sessionId}:`, error);
                    delete activeTransports[transport.sessionId]; // Clean up on connection error
                    if (!res.writableEnded) {
                        res.writeHead(500, { "Content-Type": "text/plain" });
                        res.end("Error setting up MCP connection");
                    }
                }
            } else if (req.method === "POST" && requestUrl.pathname === MESSAGE_ENDPOINT_BASE) {
                const sessionId = requestUrl.searchParams.get("sessionId");
                console.error(`[HTTP] POST request to ${MESSAGE_ENDPOINT_BASE} with sessionId: ${sessionId}`);

                if (!sessionId) {
                    console.error("[HTTP] Missing sessionId in POST request's query parameters");
                    res.writeHead(400, { "Content-Type": "text/plain" });
                    res.end("Missing sessionId query parameter");
                    return;
                }

                const transport = activeTransports[sessionId];
                if (transport) {
                    let body = "";
                    req.on("data", chunk => {
                        body += chunk.toString();
                    });
                    req.on("end", async () => {
                        try {
                            console.log('req.on("end") body:', body);
                            const parsedBody = JSON.parse(body);
                            console.error(`[HTTP] Received POST body  for sessionId ${sessionId}:`, parsedBody);
                            console.error(`[HTTP] Forwarding POST body to transport ${sessionId}`);
                            await transport.handlePostMessage(req, res, parsedBody);
                            // SSEServerTransport.handlePostMessage handles sending the HTTP response (e.g., 204)
                        } catch (e) {
                            console.error(`[HTTP] Error parsing JSON body or handling POST for ${sessionId}:`, e);
                            if (!res.writableEnded) {
                                res.writeHead(400, { "Content-Type": "text/plain" });
                                res.end("Invalid JSON body");
                            }
                        }
                    });
                    req.on("error", (err) => {
                        console.error(`[HTTP] Error reading POST request body for ${sessionId}:`, err);
                        if (!res.writableEnded) {
                            res.writeHead(500, { "Content-Type": "text/plain" });
                            res.end("Error reading request body");
                        }
                    });
                } else {
                    console.error(`[HTTP] No active transport found for sessionId: ${sessionId}`);
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end("Session not found or expired");
                }
            } else if (req.method === "GET" && requestUrl.pathname === "/") {
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end(`MCP Server is running! SSE at ${SSE_ENDPOINT}, POST to ${MESSAGE_ENDPOINT_BASE}?sessionId=...`);
            } else {
                console.error(`[HTTP] 404 for ${req.method} ${req.url}`);
                res.writeHead(404);
                res.end();
            }
        });

        httpServer.listen(PORT, () => {
            console.error(`[HTTP] ${SERVER_NAME} v${SERVER_VERSION} listening on port ${PORT}`);
            console.error(`[HTTP] MCP SSE connections expected at ${SSE_ENDPOINT}`);
            console.error(`[HTTP] MCP messages expected via POST to ${MESSAGE_ENDPOINT_BASE}?sessionId=<sessionId>`);
        });

        // StdioTransport is no longer used with an HTTP server setup.
        // const transport = new StdioServerTransport();
        // console.error(`${SERVER_NAME} v${SERVER_VERSION} starting...`);
        // await server.connect(transport);
        // // await server.server.connect(transport);
        // console.error(`${SERVER_NAME} connected and ready`);


        console.error(`[MCP] ${SERVER_NAME} v${SERVER_VERSION} initialized and ready to accept HTTP connections.`);
    } catch (error) {
        console.error("Fatal error initializing server:", error);
        // process.exit(1);
    }
}

main();