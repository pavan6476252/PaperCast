import { z } from "zod";
import * as fs from "fs";
import * as path from "path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendCommandToActiveSession } from "../services/ws.js";
import { WsEventType } from "@formcast/core/ws";
// to-replace

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
    async ({ schema: providedSchema, outputPath }) => {
      let finalSchema = providedSchema;

      if (!finalSchema) {
        const wsResponse = await sendCommandToActiveSession({
          type: WsEventType.GET_CURRENT_SCHEMA,
        });
        finalSchema = wsResponse.schema;
      }

      console.error("Calling Next.js API for PDF generation...");

      const appUrl =
        process.env.APP_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        (process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:8000");

      const response = await fetch(`${appUrl}/api/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalSchema),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`PDF generation API failed: ${errText}`);
      }

      const buffer = await response.arrayBuffer();
      const outputFilename = outputPath || `print-${Date.now()}.pdf`;
      const resolvedPath = path.isAbsolute(outputFilename)
        ? outputFilename
        : path.join(process.cwd(), outputFilename);

      fs.writeFileSync(resolvedPath, Buffer.from(buffer));
      return {
        content: [
          {
            type: "text" as const,
            text: `Successfully generated PDF and wrote to file: ${resolvedPath}`,
          },
        ],
      };
    }
  );
}
