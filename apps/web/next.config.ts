import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../../"),
  transpilePackages: [
    "@papercast/core",
    "@papercast/engine",
    "@papercast/react",
  ],
  outputFileTracingIncludes: {
    "/api/pdf": [
      "node_modules/@sparticuz/chromium/**",
      "../../node_modules/.pnpm/@sparticuz+chromium@*/**",
    ],
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
  allowedDevOrigins: ["192.168.1.17"],
};

export default nextConfig;
