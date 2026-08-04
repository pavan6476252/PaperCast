import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { initWebSocketServer } from "./services/ws.js";
import { registerResources } from "./resources/index.js";
import { registerTools } from "./tools/index.js";

const server = new McpServer({
  name: "formcast-mcp-server",
  version: "1.0.0",
});

// Initialize the WebSocket Server for browser sync
initWebSocketServer(9000);

// Register MCP handlers
registerResources(server);
registerTools(server);

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("FormCast MCP Server running on stdio transport");
}

run().catch((error) => {
  console.error("Fatal error running MCP Server:", error);
  process.exit(1);
});
