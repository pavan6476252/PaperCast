import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getCurrentSchemaFromSession } from "../services/ws.js";

import invoiceTemplate from "@papercast/core/invoice.template.json";
import reportTemplate from "@papercast/core/report.template.json";
import papercastSchema from "@papercast/core/schema.json";
// to-replace

export function registerResources(server: McpServer) {
  server.registerResource(
    "schema-specification",
    "papercast://schema/specification",
    {
      description:
        "The complete JSON Schema validating PaperCast document templates.",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(papercastSchema, null, 2),
        },
      ],
    })
  );

  server.registerResource(
    "current-schema",
    "papercast://schema/current",
    {
      description:
        "The layout schema currently loaded in the active browser tab.",
    },
    async (uri) => {
      try {
        const state = await getCurrentSchemaFromSession();
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "application/json",
              text: JSON.stringify(state.schema, null, 2),
            },
          ],
        };
      } catch (e: any) {
        throw new Error(`Failed to get active schema: ${e.message}`);
      }
    }
  );

  server.registerResource(
    "invoice-template",
    "papercast://template/invoice",
    { description: "Starter invoice template schema." },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(invoiceTemplate, null, 2),
        },
      ],
    })
  );

  server.registerResource(
    "report-template",
    "papercast://template/report",
    { description: "Starter report layout schema." },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(reportTemplate, null, 2),
        },
      ],
    })
  );
}
