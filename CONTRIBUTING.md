# Contributing to FormCast

Thank you for your interest in contributing to FormCast!

## Monorepo Setup

FormCast uses Turborepo and `pnpm` for package management.

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

## Submitting Pull Requests

1. Create a new branch: `git checkout -b feature/my-feature`
2. Make your changes.
3. Ensure the project builds successfully and passes formatting:
   ```bash
   pnpm run build
   pnpm run lint
   ```
4. Push to your fork and submit a PR!

Please provide clear descriptions in your pull requests and link any relevant issues.
