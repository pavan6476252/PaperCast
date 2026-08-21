import { MetadataRoute } from "next";
import { DOC_PAGES } from "./(marketing)/docs/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://paper-cast-web.vercel.app";

  const docUrls: MetadataRoute.Sitemap = DOC_PAGES.map((page) => ({
    url: `${baseUrl}/docs/${page.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...docUrls,
  ];
}
