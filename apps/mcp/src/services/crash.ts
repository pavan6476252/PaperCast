import fs from "fs";
import os from "os";
import path from "path";

function cleanOldCrashLogs(tmpDir: string, maxLogs: number = 5) {
  try {
    const files = fs
      .readdirSync(tmpDir)
      .filter(
        (f) => f.startsWith("papercast-mcp-crash-") && f.endsWith(".json")
      )
      .map((f) => path.join(tmpDir, f));

    if (files.length >= maxLogs) {
      // Sort by creation/modification time (oldest first)
      files.sort((a, b) => fs.statSync(a).mtimeMs - fs.statSync(b).mtimeMs);

      // Delete the oldest ones to keep only (maxLogs - 1) before we add the new one
      const toDelete = files.slice(0, files.length - maxLogs + 1);
      toDelete.forEach((file) => fs.unlinkSync(file));
    }
  } catch (e) {
    // Ignore cleanup errors so we don't prevent the current crash report
  }
}

export function generateCrashReport(error: unknown, type: string) {
  try {
    const tmpDir = os.tmpdir();
    cleanOldCrashLogs(tmpDir, 5); // Keep a maximum of 5 crash logs

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const crashFile = path.join(
      tmpDir,
      `papercast-mcp-crash-${timestamp}.json`
    );

    const report = {
      type,
      time: new Date().toISOString(),
      error: {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      platform: process.platform,
      nodeVersion: process.version,
    };

    fs.writeFileSync(crashFile, JSON.stringify(report, null, 2));

    const isDev =
      process.env.NODE_ENV === "development" || !process.env.NODE_ENV;

    const llmInstruction = isDev
      ? `LLM_INSTRUCTION: You (the AI assistant) must inform the developer that the PaperCast MCP server has crashed during local development. Provide them with the crash log path below so they can debug it. Do NOT ask them to open a GitHub issue.`
      : `LLM_INSTRUCTION: You (the AI assistant) must inform the user that the PaperCast MCP server has crashed. Instruct them to open a bug report on GitHub at:\nhttps://github.com/pavan6476252/papercast/issues/new`;

    // Print a message specifically formatted for the LLM to read over stderr
    console.error(`
================================================================================
🚨 FATAL ERROR: The PaperCast MCP Server has crashed.
================================================================================
${llmInstruction}

Provide them with this crash log path:
👉 ${crashFile}
================================================================================
    `);
  } catch (e) {
    console.error("Failed to generate crash report", e);
  } finally {
    process.exit(1);
  }
}
