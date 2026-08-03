import { DOC_CATEGORIES } from "../(marketing)/docs/config";
import fs from "fs";
import path from "path";

export async function GET() {
  const baseUrl = "https://formcast.dev";

  let content = `# FormCast Documentation for AI Agents

FormCast is a Schema-First Document Builder and Renderer.

This document contains the concatenated full text of all documentation pages.

`;

  DOC_CATEGORIES.forEach((category) => {
    content += `\n# Category: ${category.title}\n`;
    category.pages.forEach((page) => {
      content += `\n## ${page.title}\n`;
      content += `Source: ${baseUrl}/docs/${page.id}\n\n`;

      const filePath = path.join(
        process.cwd(),
        "content",
        "docs",
        `${page.id}.mdx`
      );
      try {
        const mdxSource = fs.readFileSync(filePath, "utf-8");
        content += `${mdxSource}\n\n---\n`;
      } catch {
        content += `(Content currently unavailable)\n\n---\n`;
      }
    });
  });

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
