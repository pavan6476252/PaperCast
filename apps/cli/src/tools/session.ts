import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  sessions,
  activeSessionId,
  setActiveSessionId,
} from "../services/ws.js";

export function registerSessionTools(server: McpServer) {
  server.registerTool(
    "get_active_sessions",
    {
      description:
        "List all connected FormCast playground tabs and identify which session is active. Use this tool if you need to know how many sessions are active and to determine which one you are connected to.",
    },
    async () => {
      const sessionList = Array.from(sessions.entries()).map(([id, s]) => ({
        sessionId: id,
        title: s.title,
        lastActive: new Date(s.lastActive).toISOString(),
        isActive: id === activeSessionId,
      }));
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              { activeSessionId, sessions: sessionList },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.registerTool(
    "select_active_session",
    {
      description: "Select which connected tab to control.",
      inputSchema: {
        sessionId: z.string().describe("The ID of the target session."),
      },
    },
    async ({ sessionId }) => {
      if (!sessions.has(sessionId)) {
        throw new Error(`Session ${sessionId} not found.`);
      }
      setActiveSessionId(sessionId);
      return {
        content: [
          {
            type: "text" as const,
            text: `Active session switched to ${sessionId}`,
          },
        ],
      };
    }
  );
}
