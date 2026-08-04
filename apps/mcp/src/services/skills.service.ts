import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";

// In CommonJS, __dirname is available globally.

export async function listFormcastSkills() {
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

export async function readFormcastSkill(skillSlug: string) {
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
