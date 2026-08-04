# CI/CD and Deployment Architecture

This document outlines the Continuous Integration and Continuous Deployment (CI/CD) pipelines and Vercel deployment strategies used in this repository.

## GitHub Actions Workflows

We use three primary GitHub Actions workflows located in `.github/workflows/`:

### 1. CI Workflow (`ci.yml`)

- **Trigger**: Runs on `push` and `pull_request` to the `main` and `staged` branches.
- **Purpose**: Acts as the gatekeeper for codebase health.
- **Jobs**: Installs dependencies, runs linters, executes unit/integration tests, validates the JSON schema, and builds the packages.
- **Rules**: Pull Requests cannot be merged if this workflow fails.

### 2. Release Workflow (`release.yml`)

- **Trigger**: Runs on `workflow_run` (specifically, it waits for the `CI` workflow to complete successfully on the `main` branch).
- **Purpose**: Handles package versioning and publishing to NPM via Changesets.
- **Process**:
  1. Checks out the code.
  2. Builds the packages (`pnpm run build`) independently to generate fresh artifacts in the runner environment.
  3. Uses `changesets/action` to either create a "Version Packages" PR or publish the packages if a Version PR was merged.

### 3. Vercel Preview Deploy (`vercel-preview.yml`)

- **Trigger**: Runs on `pull_request` events (`opened`, `synchronize`, `reopened`, `edited`) targeting the `main` and `staged` branches.
- **Purpose**: Manually controls when Vercel generates Preview Deployments to optimize Vercel Free Tier usage and prevent unnecessary builds.
- **Logic**:
  - If the PR targets **`main`**: Automatically triggers a Preview deployment.
  - If the PR targets **`staged`**: ONLY triggers a Preview deployment if the PR title contains the keyword `[deploy]`.
- **Requirements**: Requires `VERCEL_TOKEN`, `VERCEL_ORG_ID` (User ID for Hobby accounts), and `VERCEL_PROJECT_ID` as GitHub Secrets.

## Vercel Dashboard Configuration

To prevent duplicate builds and conflicts with our GitHub Actions, the Vercel project is configured with an **Ignored Build Step**:

```bash
if [ "$VERCEL_GIT_COMMIT_REF" == "main" ]; then exit 1; else exit 0; fi
```

### How it works:

1. **Production**: When code is merged/pushed directly to the `main` branch, the script evaluates to `exit 1` (Proceed). Vercel natively handles the Production deployment automatically.
2. **Pull Requests**: When code is pushed to a feature branch (e.g., `feat/abc`), the script evaluates to `exit 0` (Cancel). Vercel's automatic system ignores the commit. The GitHub Action (`vercel-preview.yml`) takes over and uses the Vercel CLI to generate the Preview deployment if the conditions are met.

This architecture ensures maximum safety, optimal usage of free tier limits, and full control over preview environments.
