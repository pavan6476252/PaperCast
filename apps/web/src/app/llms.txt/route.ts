import { DOC_CATEGORIES } from "../(marketing)/docs/config";

export async function GET() {
  const baseUrl = "https://formcast.dev";

  let content = `# FormCast Documentation for AI Agents

FormCast is a Schema-First Document Builder and Renderer.

Here is the documentation structure:
`;

  DOC_CATEGORIES.forEach((category) => {
    content += `\n## ${category.title}\n`;
    category.pages.forEach((page) => {
      content += `- [${page.title}](${baseUrl}/docs/${page.id}): ${page.description}\n`;
    });
  });

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
