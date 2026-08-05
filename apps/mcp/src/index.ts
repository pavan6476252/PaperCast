import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { initWebSocketServer } from "./services/ws.js";
import { registerResources } from "./resources/index.js";
import { registerTools } from "./tools/index.js";

const server = new McpServer({
  name: "papercast-mcp-server",
  version: "1.0.0",
});

// Initialize the WebSocket Server for browser sync
initWebSocketServer(9000);

// Register MCP handlers
registerResources(server);
registerTools(server);

import { generateCrashReport } from "./services/crash.js";

process.on("uncaughtException", (error) =>
  generateCrashReport(error, "uncaughtException")
);
process.on("unhandledRejection", (reason) =>
  generateCrashReport(reason, "unhandledRejection")
);

// Catch internal MCP protocol and transport errors (e.g., serialization failures, EOFs)
server.server.onerror = (error) => {
  generateCrashReport(error, "mcpProtocolError");
};

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("PaperCast MCP Server running on stdio transport");

  // Ensure the Node process exits when the IDE disconnects the stdio transport
  process.stdin.on("close", () => {
    console.error("MCP Server stdio closed by IDE. Exiting process...");
    process.exit(0);
  });

  process.stdin.on("end", () => {
    console.error("MCP Server stdio ended by IDE. Exiting process...");
    process.exit(0);
  });
}

run().catch((error) => {
  generateCrashReport(error, "startupError");
});
