import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content", "docs", `${slug}.mdx`);

  let mdxSource = "";
  try {
    mdxSource = fs.readFileSync(filePath, "utf-8");
  } catch {
    return new Response(
      `# Not Found\n\nThe requested documentation page "${slug}" could not be found.`,
      { status: 404, headers: { "Content-Type": "text/markdown" } }
    );
  }

  return new Response(mdxSource, {
    headers: {
      "Content-Type": "text/markdown",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
