import * as fs from "fs";
import * as path from "path";
import { sendCommandToActiveSession } from "./ws.js";
import { WsEventType } from "@formcast/core/ws";

export async function generatePdf(providedSchema?: any, outputPath?: string) {
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
