---
name: adding-web-changelogs
description: Guidelines for adding new entries to the user-facing marketing Changelog (changelog.mdx). Use when asked to write or update release notes for the web app.
---

# Web Changelog Guidelines

The PaperCast marketing site has a user-facing Changelog located at `apps/web/content/changelog.mdx`. Unlike automated Changesets (which are used for NPM package versioning), this changelog is a **marketing tool** designed to be read by end-users.

## When to use this skill

Use this skill when you are asked to draft release notes, update the changelog, or summarize recent web app features for the public.

## Process

1. **Locate the File**: Open `apps/web/content/changelog.mdx`.
2. **Create a New Version Block**: Insert a new `<Version>` component at the top of the file (just below the title).
3. **Write Curated Copy**: Do not simply dump git commit logs. Write exciting, benefit-driven copy that highlights the value of the new features.
4. **Use Semantic Badges**: Tag each bullet point with the appropriate `<Badge>` component.
5. **Sync Package Version**: Open `apps/web/package.json` and update the `"version"` field to match the exact version number you just added to the changelog. This ensures the technical package version always mirrors the marketing version.

## Required MDX Structure

Always use the custom MDX components available in the route:

```mdx
<Version version="x.x.x" date="YYYY-MM-DD">

A short, exciting summary of what this release brings to the users.

### Added

- <Badge type="feature">Feature</Badge> Added a brand new...
- <Badge type="improvement">Improvement</Badge> Significantly enhanced the
  performance of...

### Fixed

- <Badge type="fix">Fix</Badge> Resolved an issue where...

</Version>
```

**Valid Badge Types:** `feature`, `fix`, `improvement`, `breaking`.
