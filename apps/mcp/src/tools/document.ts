import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as documentService from "../services/document.service.js";

export function registerDocumentTools(server: McpServer) {
  server.registerTool(
    "get_document_state",
    {
      description:
        "Get the complete active FormCast document schema JSON currently opened in the browser. IMPORTANT: If there are multiple active sessions, use get_active_sessions to check and select_active_session to explicitly target one.",
      annotations: { readOnlyHint: true },
    },
    async () => documentService.getDocumentState()
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
    async ({ schema }) => documentService.setDocumentState(schema)
  );

  server.registerTool(
    "replace_document_body",
    {
      description:
        "Clears all existing children in the document body and inserts a new array of nodes. DO NOT place Header or Footer elements inside the body. Use set_document_section for true repeating page headers and footers.",
      inputSchema: {
        children: z
          .array(z.record(z.string(), z.any()))
          .describe(
            "Array of new BaseNode objects to insert into body.children"
          ),
      },
      annotations: { idempotentHint: true, destructiveHint: true },
    },
    async ({ children }) => documentService.replaceDocumentBody(children)
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
    async ({ data }) => documentService.updateDocumentData(data)
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
    async ({ sectionType, sectionKey, sectionData }) =>
      documentService.setDocumentSection(sectionType, sectionKey, sectionData)
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
    async ({ sectionType, sectionKey }) =>
      documentService.deleteDocumentSection(sectionType, sectionKey)
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
    async ({ patch }) => documentService.updateDocumentMeta(patch)
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
    async ({ patch }) => documentService.updateDocumentTheme(patch)
  );
}
