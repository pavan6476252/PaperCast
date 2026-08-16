import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { withErrorBoundary } from "../utils/error.js";
import icons from "../../../../packages/core/src/schema/icons.json" with { type: "json" };

function getIconNames(): string[] {
  return icons || [];
}

export function registerIconsTools(server: McpServer) {
  server.registerTool(
    "search_icons",
    {
      description:
        "Search for valid Lucide icon names to use with the Icon node. Always use this to find the correct PascalCase icon name.",
      inputSchema: {
        query: z
          .string()
          .describe(
            "Search query to match against icon names (e.g., 'arrow', 'user'). If empty, returns a sample list."
          ),
      },
    },
    withErrorBoundary(async ({ query }) => {
      const allIcons = getIconNames();

      if (!allIcons || allIcons.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "Error: Icons list is empty or could not be loaded.",
            },
          ],
          isError: true,
        };
      }

      if (!query) {
        return {
          content: [
            {
              type: "text",
              text: `Found ${allIcons.length} total icons. Samples:\n${allIcons.slice(0, 50).join(", ")}`,
            },
          ],
        };
      }

      const lowerQuery = query.toLowerCase().replace(/[^a-z0-9]/g, "");
      const results = allIcons.filter((name) =>
        name.toLowerCase().includes(lowerQuery)
      );

      const topResults = results.slice(0, 50);

      if (results.length === 0) {
        return {
          content: [
            { type: "text", text: `No icons found matching '${query}'.` },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Found ${results.length} matches for '${query}'.\nTop results:\n${topResults.join("\n")}`,
          },
        ],
      };
    })
  );
}
