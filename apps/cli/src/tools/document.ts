import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendCommandToActiveSession } from "../services/ws.js";
import { deepMerge, validateAndSend } from "../services/ast.js";
import { WsEventType } from "@formcast/core";

export function registerDocumentTools(server: McpServer) {
  server.registerTool(
    "get_document_state",
    {
      description:
        "Get the complete active FormCast document schema JSON currently opened in the browser. IMPORTANT: If there are multiple active sessions, use get_active_sessions to check and select_active_session to explicitly target one.",
      annotations: { readOnlyHint: true },
    },
    async () => {
      const state = await sendCommandToActiveSession({
        type: WsEventType.GET_CURRENT_SCHEMA,
      });
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(state.schema, null, 2),
          },
        ],
      };
    }
  );

  server.registerTool(
    "set_document_state",
    {
      description:
        "Overwrite the entire document layout schema with a new JSON object. Example props: { schema: { document: { body: { ... } } } }",
      inputSchema: {
        schema: z
          .record(z.string(), z.any())
          .describe("The complete valid FormCast JSON layout schema."),
      },
      annotations: { idempotentHint: true, destructiveHint: true },
    },
    async ({ schema }) => {
      return validateAndSend(
        schema,
        "Successfully sent validated updated schema layout to browser tab."
      );
    }
  );

  server.registerTool(
    "replace_document_body",
    {
      description:
        "Clears all existing children in the document body and inserts a new array of nodes.",
      inputSchema: {
        children: z
          .array(z.record(z.string(), z.any()))
          .describe(
            "Array of new BaseNode objects to insert into body.children"
          ),
      },
      annotations: { idempotentHint: true, destructiveHint: true },
    },
    async ({ children }) => {
      const state = await sendCommandToActiveSession({
        type: WsEventType.GET_CURRENT_SCHEMA,
      });
      const newSchema = JSON.parse(JSON.stringify(state.schema));
      newSchema.document.body.children = children;
      return validateAndSend(
        newSchema,
        "Successfully replaced document body children and passed validation."
      );
    }
  );

  server.registerTool(
    "update_document_data",
    {
      description:
        "Updates the `data` JSON object used for bindings. Merges provided object with existing data. Example: { revenue: 100 }",
      inputSchema: {
        data: z
          .record(z.string(), z.any())
          .describe("JSON object to merge into schema.data"),
      },
      annotations: { idempotentHint: true },
    },
    async ({ data }) => {
      const state = await sendCommandToActiveSession({
        type: WsEventType.GET_CURRENT_SCHEMA,
      });
      const newSchema = JSON.parse(JSON.stringify(state.schema));
      newSchema.data = newSchema.data || {};
      deepMerge(newSchema.data, data);
      return validateAndSend(
        newSchema,
        "Successfully merged new data into document state."
      );
    }
  );

  server.registerTool(
    "set_document_section",
    {
      description:
        "Upserts an entire DocumentSection into document.headers or document.footers.",
      inputSchema: {
        sectionType: z
          .enum(["headers", "footers"])
          .describe("Whether it is a header or footer."),
        sectionKey: z
          .string()
          .describe(
            "The key of the section (e.g., 'odd', 'even', 'first', 'common')."
          ),
        sectionData: z
          .record(z.string(), z.any())
          .describe(
            "The complete DocumentSection object including condition and root node."
          ),
      },
      annotations: { idempotentHint: true },
    },
    async ({ sectionType, sectionKey, sectionData }) => {
      const state = await sendCommandToActiveSession({
        type: WsEventType.GET_CURRENT_SCHEMA,
      });
      const newSchema = JSON.parse(JSON.stringify(state.schema));
      newSchema.document[sectionType] = newSchema.document[sectionType] || {};
      newSchema.document[sectionType][sectionKey] = sectionData;
      return validateAndSend(
        newSchema,
        `Successfully set document ${sectionType} section: ${sectionKey}`
      );
    }
  );

  server.registerTool(
    "delete_document_section",
    {
      description:
        "Completely removes a DocumentSection by key from headers or footers.",
      inputSchema: {
        sectionType: z.enum(["headers", "footers"]),
        sectionKey: z.string().describe("The key of the section to delete."),
      },
      annotations: { idempotentHint: true, destructiveHint: true },
    },
    async ({ sectionType, sectionKey }) => {
      const state = await sendCommandToActiveSession({
        type: WsEventType.GET_CURRENT_SCHEMA,
      });
      const newSchema = JSON.parse(JSON.stringify(state.schema));
      if (
        newSchema.document[sectionType] &&
        newSchema.document[sectionType][sectionKey]
      ) {
        delete newSchema.document[sectionType][sectionKey];
      }
      return validateAndSend(
        newSchema,
        `Successfully deleted document ${sectionType} section: ${sectionKey}`
      );
    }
  );

  server.registerTool(
    "update_document_meta",
    {
      description:
        "Deep merges properties into the document.meta object (e.g. pageSize, orientation).",
      inputSchema: {
        patch: z
          .record(z.string(), z.any())
          .describe("Partial meta object to merge."),
      },
      annotations: { idempotentHint: true },
    },
    async ({ patch }) => {
      const state = await sendCommandToActiveSession({
        type: WsEventType.GET_CURRENT_SCHEMA,
      });
      const newSchema = JSON.parse(JSON.stringify(state.schema));
      newSchema.meta = newSchema.meta || {};
      deepMerge(newSchema.meta, patch);
      return validateAndSend(
        newSchema,
        "Successfully merged properties into document.meta."
      );
    }
  );

  server.registerTool(
    "update_document_theme",
    {
      description:
        "Deep merges properties into the document.theme.defaults object.",
      inputSchema: {
        patch: z
          .record(z.string(), z.any())
          .describe("Partial theme defaults object to merge."),
      },
      annotations: { idempotentHint: true },
    },
    async ({ patch }) => {
      const state = await sendCommandToActiveSession({
        type: "GET_CURRENT_SCHEMA",
      });
      const newSchema = JSON.parse(JSON.stringify(state.schema));
      newSchema.theme = newSchema.theme || {};
      newSchema.theme.defaults = newSchema.theme.defaults || {};
      deepMerge(newSchema.theme.defaults, patch);
      return validateAndSend(
        newSchema,
        "Successfully merged properties into document.theme.defaults."
      );
    }
  );
}
