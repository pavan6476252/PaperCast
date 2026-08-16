import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerSessionTools } from "./session.js";
import { registerDocumentTools } from "./document.js";
import { registerLayoutTools } from "./layout.js";
import { registerSkillsTools } from "./skills.js";
import { registerPdfTools } from "./pdf.js";
import { registerWorkspaceTools } from "./workspace.js";
import { registerIconsTools } from "./icons.js";

export function registerTools(server: McpServer) {
  registerSessionTools(server);
  registerDocumentTools(server);
  registerLayoutTools(server);
  registerSkillsTools(server);
  registerPdfTools(server);
  registerWorkspaceTools(server);
  registerIconsTools(server);
}
