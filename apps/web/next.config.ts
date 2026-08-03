import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@formcast/core", "@formcast/engine", "@formcast/react"],
  outputFileTracingIncludes: {
    "/api/pdf/**": ["node_modules/@sparticuz/chromium/**"],
  },
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
  async rewrites() {
    return [
      {
        source: "/docs/:slug\\.md",
        destination: "/api/docs/:slug",
      },
    ];
  },
};

export default nextConfig;
