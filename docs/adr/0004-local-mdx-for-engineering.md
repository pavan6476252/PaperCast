# 4. Local MDX for Engineering Blogs

Date: 2026-08-16

## Status

Accepted

## Context

We need a system to host "Engineering Blogs" (or Case Studies) on the marketing site to demonstrate the capabilities of the builder. We considered integrating a headless CMS (like Sanity, Contentful, or Strapi) to manage this content. However, the content will heavily feature code snippets, JSON schemas, and technical explanations that are closely tied to the state of the repository at the time of writing.

## Decision

We will use local MDX files stored in `apps/web/content/engineering/*.mdx` to manage engineering blog posts.

The frontmatter for these files will strictly require:

- `title`
- `description`
- `date`
- `author`
- `coverImage`

We will leverage our existing MDX rendering pipeline (using `next-mdx-remote`) and our existing custom MDX React components to render the posts.

## Consequences

- **Positive:** No external dependencies or vendor lock-in for marketing content.
- **Positive:** Content is version-controlled alongside the code it describes, ensuring examples don't go out of sync with the engine version.
- **Positive:** We can reuse the `shiki` syntax highlighter and custom components from the documentation system.
- **Negative:** Non-technical marketing members cannot easily publish or edit posts without pushing to the Git repository.
