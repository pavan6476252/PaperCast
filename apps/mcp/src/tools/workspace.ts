import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  sendCommandToActiveSession,
  fireCommandToActiveSession,
} from "../services/ws.js";
import { WsEventType, WorkspaceSchemaMetadata } from "@formcast/core/ws";

export function registerWorkspaceTools(server: McpServer) {
  server.tool(
    "workspace_list_schemas",
    "List all schemas currently saved in the browser's local workspace (IndexedDB). Use this to discover available schemas you can load.",
    {},
    async () => {
      try {
        const response = await sendCommandToActiveSession({
          type: WsEventType.WORKSPACE_LIST_REQ,
        });

        const schemas = response.schemas || [];
        return {
          content: [
            {
              type: "text",
              text:
                schemas.length > 0
                  ? `Found ${schemas.length} saved schemas:\n` +
                    schemas
                      .map(
                        (s: WorkspaceSchemaMetadata) =>
                          `- ID: ${s.id} | Name: ${s.name} | Updated: ${new Date(s.updatedAt).toLocaleString()}`
                      )
                      .join("\n")
                  : "No schemas found in the workspace.",
            },
          ],
        };
      } catch (err: unknown) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "workspace_load_schema",
    "Command the browser to load a specific schema from the workspace into the active editor session.",
    {
      id: z
        .string()
        .describe(
          "The ID of the schema to load, obtained from workspace_list_schemas."
        ),
    },
    async ({ id }) => {
      try {
        fireCommandToActiveSession({
          type: WsEventType.WORKSPACE_LOAD,
          id,
        });
        return {
          content: [
            { type: "text", text: `Command sent to load schema ${id}.` },
          ],
        };
      } catch (err: unknown) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "workspace_save_schema",
    "Command the browser to persist the currently active schema in the editor to the workspace.",
    {},
    async () => {
      try {
        fireCommandToActiveSession({
          type: WsEventType.WORKSPACE_SAVE,
        });
        return {
          content: [
            { type: "text", text: "Command sent to save the current schema." },
          ],
        };
      } catch (err: unknown) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "workspace_delete_schema",
    "Command the browser to delete a specific schema from the workspace.",
    {
      id: z.string().describe("The ID of the schema to delete."),
    },
    async ({ id }) => {
      try {
        fireCommandToActiveSession({
          type: WsEventType.WORKSPACE_DELETE,
          id,
        });
        return {
          content: [
            { type: "text", text: `Command sent to delete schema ${id}.` },
          ],
        };
      } catch (err: unknown) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
