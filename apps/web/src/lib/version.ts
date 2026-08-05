import { promises as fs } from "fs";
import path from "path";

/**
 * Parses the marketing changelog.mdx to extract the latest public-facing version.
 * This ensures the UI version is decoupled from the automated package.json version.
 */
export async function getLatestVersion(): Promise<string> {
  try {
    const changelogPath = path.join(process.cwd(), "content/changelog.mdx");
    const content = await fs.readFile(changelogPath, "utf-8");

    // Match the first <Version version="x.x.x" tag
    const match = content.match(/<Version version="([^"]+)"/);

    if (match && match[1]) {
      return match[1];
    }
  } catch (error) {
    console.error("Failed to parse changelog version:", error);
  }

  return "0.1.0"; // Fallback
}
