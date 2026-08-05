# Decoupling Marketing UI Version from Package Version

We decided to ignore `apps/web/package.json` for tracking the public-facing version of the web application. Instead, the UI reads the topmost `<Version>` tag directly from `apps/web/content/changelog.mdx`.

This is because Changesets (which manages our `package.json` versions) is an automated NPM tool designed for technical dependency tracking. However, the Web App's Changelog is a **marketing tool**. Tying the "What's New" UI animation to automated technical bumps (like silent hotfixes or typo corrections) would result in a spammy, annoying user experience.

By decoupling them, the Changelog becomes the definitive source of truth. Users only see the "What's New" animation when we manually curate and publish a marketing release in the MDX file.
