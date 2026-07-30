import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@formcast/core"],
  outputFileTracingIncludes: {
    "/api/pdf/**": ["node_modules/@sparticuz/chromium/**"],
  },
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
};

export default nextConfig;
