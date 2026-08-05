import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@papercast/core",
    "@papercast/engine",
    "@papercast/react",
  ],
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
  allowedDevOrigins: ["10.11.17.178"],
};

export default nextConfig;
