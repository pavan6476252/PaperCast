import { z } from "zod";
import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerSkillsTools(server: McpServer) {
  server.registerTool(
    "list_formcast_skills",
    {
      description:
        "MASTER PROMPT: You are interacting with the FormCast AST. Before attempting to use any widget (e.g. Table, Text) or layout tools (e.g. BoxModel, styling), you MUST ALWAYS call this tool first to find the relevant schema rules. Do NOT guess the AST schema. Call this tool to list all available granular skill files with their descriptions, find the exact one you need (e.g. 'widget-TableNode.md'), and then read it using 'read_formcast_skill'.",
      annotations: { readOnlyHint: true },
    },
    async () => {
      const docsPath = path.join(__dirname, "../../mcp-skills");
      if (!fs.existsSync(docsPath)) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Docs directory not found at ${docsPath}`,
            },
          ],
        };
      }

      const files = fs.readdirSync(docsPath).filter((f) => f.endsWith(".md"));
      const skillSummaries = files.map((f) => {
        const filePath = path.join(docsPath, f);
        try {
          const fileContent = fs.readFileSync(filePath, "utf8");
          const { data } = matter(fileContent);
          const description = data.description || "No description provided.";
          return `- **${f}**: ${description}`;
        } catch (e) {
          return `- **${f}**: Could not parse description.`;
        }
      });

      return {
        content: [
          {
            type: "text" as const,
            text: `Available FormCast Skills/Docs:\n\n${skillSummaries.join("\n")}\n\nUse the 'read_formcast_skill' tool with the exact filename to read its full contents.`,
          },
        ],
      };
    }
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
    async ({ skillSlug }) => {
      const docsPath = path.join(__dirname, "../../mcp-skills", skillSlug);
      const resolvedDocsDir = path.resolve(__dirname, "../../mcp-skills");
      const resolvedTargetPath = path.resolve(docsPath);

      if (!resolvedTargetPath.startsWith(resolvedDocsDir)) {
        throw new Error(
          "Invalid skill path. Cannot traverse directories outside of mcp-skills."
        );
      }

      if (!fs.existsSync(resolvedTargetPath)) {
        throw new Error(`Skill file not found: ${skillSlug}`);
      }

      const content = fs.readFileSync(resolvedTargetPath, "utf8");
      return {
        content: [
          {
            type: "text" as const,
            text: content,
          },
        ],
      };
    }
  );
}
