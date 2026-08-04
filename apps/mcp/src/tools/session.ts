import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as sessionService from "../services/session.service.js";

export function registerSessionTools(server: McpServer) {
  server.registerTool(
    "get_active_sessions",
    {
      description:
        "MASTER INSTRUCTION: If the user asks to 'connect to the website', 'build a form', or 'interact with the playground', this MCP server IS the connection! The PaperCast playground connects to this server via WebSockets, acting as a remote control. Do NOT use a browser tool to scrape URLs. Your first step is ALWAYS to call this tool to list the active browser tabs, then use select_active_session if needed.",
    },
    async () => sessionService.getActiveSessions()
  );

  server.registerTool(
    "select_active_session",
    {
      description: "Select which connected tab to control.",
      inputSchema: {
        sessionId: z.string().describe("The ID of the target session."),
      },
    },
    async ({ sessionId }) => sessionService.selectActiveSession(sessionId)
  );
}
