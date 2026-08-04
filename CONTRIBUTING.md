# Contributing to PaperCast

Thank you for your interest in contributing to PaperCast!

## Monorepo Setup

PaperCast uses Turborepo and `pnpm` for package management.

### Prerequisites

- Node.js >= 18
- `pnpm` >= 8

### Local Development

1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development servers:
   ```bash
   pnpm run dev
   ```

## Repository Structure

- `apps/web`: Next.js web application (Visual Editor & Playground).
- `apps/mcp`: CLI and MCP Server.
- `packages/core`: Shared business logic, types, and schema definitions.
- `packages/engine`: Core rendering and calculation engines.
- `packages/react`: React headless bindings.

## Development Workflow (Trunk-Based)

This project strictly follows Trunk-Based Development. **Nobody pushes code directly to the `main` branch.**

1. **The PR is your Testing Ground**: Create a feature branch (e.g., `feature/my-feature`) and open a Pull Request against `main`.
2. **Automated Checks**: When your PR is opened:
   - GitHub Actions will run tests, linting, and builds to ensure stability.
   - Vercel will automatically generate a temporary live "Preview Deployment" URL so reviewers can test your UI changes.
3. **Merge**: Once the tests pass and the code is reviewed, the PR is merged into `main`. This triggers the production deployment and prepares the NPM release automatically.

## Submitting Pull Requests

1. Create a new branch: `git checkout -b feature/my-feature`
2. Make your changes.
3. Ensure the project builds successfully and passes formatting:
   ```bash
   pnpm run build
   pnpm run lint
   ```
4. Push to your fork and submit a PR!

### Managing Versions with Changesets

If your pull request introduces a change that should be reflected in a package version or changelog, please run:

```bash
pnpm run changeset
```

Follow the prompts to select the packages you modified and describe the changes. This will generate a `.changeset` file which you should commit and include in your pull request.

Please provide clear descriptions in your pull requests and link any relevant issues.
