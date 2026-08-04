import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as pdfService from "../services/pdf.service.js";

export function registerPdfTools(server: McpServer) {
  server.registerTool(
    "generate_pdf",
    {
      description:
        "Export the current schema as a PDF using the local Next.js rendering API.",
      inputSchema: {
        schema: z
          .record(z.string(), z.any())
          .optional()
          .describe(
            "Optional full schema payload. If omitted, uses the active browser's current layout schema."
          ),
        outputPath: z
          .string()
          .optional()
          .describe(
            "Optional path where the generated PDF should be written relative to the workspace."
          ),
      },
    },
    async ({ schema, outputPath }) => pdfService.generatePdf(schema, outputPath)
  );
}
