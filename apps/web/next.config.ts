import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@papercast/core",
    "@papercast/engine",
    "@papercast/react",
  ],
  outputFileTracingIncludes: {
    "/api/pdf": ["node_modules/@sparticuz/chromium/**"],
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
  allowedDevOrigins: ["192.168.1.34"],
};

export default nextConfig;
