#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v pnpm >/dev/null 2>&1; then
  echo "Error: pnpm is required to install Husky hooks."
  echo "Install pnpm first: https://pnpm.io/installation"
  exit 1
fi

echo "Installing Husky git hooks..."
pnpm exec husky install

echo "Setting executable permissions on Husky scripts..."
find .husky -type f -exec chmod +x {} \;

echo "Husky setup complete. Run 'git status -- .husky .husky/_' to verify."