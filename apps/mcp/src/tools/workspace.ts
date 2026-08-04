import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  sendCommandToActiveSession,
  fireCommandToActiveSession,
} from "../services/ws.js";
import { WsEventType, WorkspaceSchemaMetadata } from "@papercast/core/ws";

export function registerWorkspaceTools(server: McpServer) {
  server.registerTool(
    "workspace_list_schemas",
    {
      description:
        "List all schemas currently saved in the browser's local workspace (IndexedDB). Use this to discover available schemas you can load.",
    },
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

  server.registerTool(
    "workspace_load_schema",
    {
      description:
        "Command the browser to load a specific schema from the workspace into the active editor session.",
      inputSchema: {
        id: z
          .string()
          .describe(
            "The ID of the schema to load, obtained from workspace_list_schemas."
          ),
      },
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

  server.registerTool(
    "workspace_save_schema",
    {
      description:
        "Command the browser to persist the currently active schema in the editor to the workspace.",
    },
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

  server.registerTool(
    "workspace_delete_schema",
    {
      description:
        "Command the browser to delete a specific schema from the workspace.",
      inputSchema: {
        id: z.string().describe("The ID of the schema to delete."),
      },
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

  server.registerTool(
    "workspace_create_schema",
    {
      description:
        "Command the browser to create a new schema in the workspace and set it as active. Optionally duplicate the current editor content, or provide a specific schema payload.",
      inputSchema: {
        name: z.string().describe("The name for the new schema."),
        schema: z
          .any()
          .optional()
          .describe(
            "Optional schema payload to initialize the new schema. If omitted, duplicates the current editor state."
          ),
      },
    },
    async ({ name, schema }) => {
      try {
        fireCommandToActiveSession({
          type: WsEventType.WORKSPACE_CREATE,
          name,
          schema,
        });
        return {
          content: [
            {
              type: "text",
              text: `Command sent to create new schema: ${name}.`,
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
}
