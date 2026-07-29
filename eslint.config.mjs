import webConfig from "./apps/web/eslint.config.mjs";

export default [
  ...webConfig,
  {
    settings: {
      next: {
        rootDir: "apps/web/"
      }
    }
  }
];
