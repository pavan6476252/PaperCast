import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/docs/", "/api/docs/"],
        disallow: ["/api/pdf/", "/api/pdf", "/print/"],
      },
      {
        userAgent: [
          "GPTBot",
          "CCBot",
          "ClaudeBot",
          "Claude-Web",
          "Google-Extended",
          "OAI-SearchBot",
          "ChatGPT-User",
        ],
        allow: ["/", "/docs/", "/api/docs/"],
        disallow: ["/api/pdf/", "/api/pdf", "/print/"],
      },
    ],
    sitemap: "https://paper-cast-web.vercel.app/sitemap.xml",
  };
}
