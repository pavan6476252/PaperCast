import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as skillsService from "../services/skills.service.js";

export function registerSkillsTools(server: McpServer) {
  server.registerTool(
    "list_formcast_skills",
    {
      description:
        "MASTER PROMPT: You are interacting with the FormCast AST. Before attempting to use any widget or layout tools, you MUST ALWAYS call this tool first to find the relevant schema rules. Do NOT guess the AST schema. IMPORTANT ARCHITECTURE RULE: When generating a complete document (like an invoice or report), DO NOT place the page Header or Footer elements inside the main layout body content. You must use `set_document_section` to define true headers/footers in the document definitions, and only place repeating/main content in the layout body. Call this tool to list all available granular skill files with their descriptions, find the exact one you need (e.g. 'widget-TableNode.md' or 'engine-HeadersAndFooters.md'), and then read it using 'read_formcast_skill'.",
      annotations: { readOnlyHint: true },
    },
    async () => skillsService.listFormcastSkills()
  );

  server.registerTool(
    "read_formcast_skill",
    {
      description:
        "Read a specific FormCast skill or documentation topic. You must pass the exact filename (e.g. 'schema-BoxModel.md' or 'widget-TableNode.md') as returned by 'list_formcast_skills'.",
      inputSchema: {
        skillSlug: z
          .string()
          .describe(
            "The filename of the documentation topic to read (e.g., 'widget-TextNode.md')."
          ),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ skillSlug }) => skillsService.readFormcastSkill(skillSlug)
  );
}
