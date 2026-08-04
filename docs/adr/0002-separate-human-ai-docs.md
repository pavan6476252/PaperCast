# Separate Content Domains for Human vs AI Docs

AI skill prompts (`mcp-skills/*.md`) are optimized for LLMs with behavioral instructions, making them confusing for human developers trying to read a tutorial. Therefore, we decided to separate the content domains. We will author specific `.mdx` files for humans in `apps/web/src/content/mcp-docs/` rather than attempting to reuse the AI skills as a single source of truth. This prevents domain conflation and ensures a high-quality, audience-appropriate reading experience.
