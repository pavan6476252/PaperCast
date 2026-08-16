import fs from "fs";
import path from "path";

export interface EngineeringPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  coverImage?: string;
  content: string;
}

const engineeringDir = path.join(process.cwd(), "content", "engineering");

export function getEngineeringPosts(): EngineeringPost[] {
  if (!fs.existsSync(engineeringDir)) return [];

  const files = fs
    .readdirSync(engineeringDir)
    .filter((file) => file.endsWith(".mdx"));

  const posts = files.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, "");
    const fullPath = path.join(engineeringDir, fileName);
    const rawContent = fs.readFileSync(fullPath, "utf-8");

    // Extremely simple frontmatter parser since we don't have gray-matter installed
    let title = "";
    let description = "";
    let date = "";
    let author = "";
    let coverImage = "";

    let contentStart = 0;
    if (rawContent.startsWith("---")) {
      const endMatch = rawContent.indexOf("---", 3);
      if (endMatch !== -1) {
        const frontmatter = rawContent.slice(3, endMatch);
        contentStart = endMatch + 3;

        frontmatter.split("\n").forEach((line) => {
          const match = line.match(/^(\w+):\s*(.+)$/);
          if (match) {
            const [, key, value] = match;
            const cleanVal = value.replace(/^["']|["']$/g, "").trim();
            if (key === "title") title = cleanVal;
            if (key === "description") description = cleanVal;
            if (key === "date") date = cleanVal;
            if (key === "author") author = cleanVal;
            if (key === "coverImage") coverImage = cleanVal;
          }
        });
      }
    }

    return {
      slug,
      title: title || slug,
      description,
      date,
      author,
      coverImage,
      content: rawContent.slice(contentStart).trim(),
    };
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getEngineeringPost(slug: string): EngineeringPost | undefined {
  const posts = getEngineeringPosts();
  return posts.find((p) => p.slug === slug);
}
