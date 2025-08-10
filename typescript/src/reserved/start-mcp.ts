// src/index.ts
import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js"
import crypto from "node:crypto";
import { MCP } from "../mcp-server"; // your file
import { randomUUID } from "node:crypto";

const app = express();
app.use(express.json());

const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// helper to build an MCP instance for this request
function buildMcp(req: express.Request) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new Error("Missing Bearer token");
  const userHash = crypto.createHash("sha256").update(token).digest("hex");

  const mcp = new MCP({ apiToken: token, userHash });
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
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  console.log(`POST Handling session: `, sessionId);
  let transport: StreamableHTTPServerTransport;

  if (sessionId && transports[sessionId]) {
    // Reuse existing transport
    transport = transports[sessionId];
  } else if (!sessionId && isInitializeRequest(req.body)) {
      try {
        const mcp = buildMcp(req);
        await mcp.init();
        const session = randomUUID();
        console.log("Received new initialization request session: ", session);

        transport = new StreamableHTTPServerTransport({
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

    } catch (err: any) {
        res.status(500).send(err?.message ?? "Internal error");
    }
  } else {
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


const handleSessionRequest = async (req: express.Request, res: express.Response) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    res.status(400).send('Invalid or missing session ID');
    return;
  }
   try {
    const transport = transports[sessionId];
        await transport.handleRequest(req, res);
  } catch (err: any) {
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
