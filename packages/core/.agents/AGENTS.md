# FormCast Core Architecture Guide

## Workspace Overview

This workspace (`packages/core`) acts as the single source of truth for the FormCast engine. It strictly isolates the business logic, schemas, and AST structures from any UI frameworks (like Next.js).

## Key Responsibilities

1. **JSON Schema Definition**: Contains `src/schema/formcast.schema.json`, which formally dictates the structure and capabilities of FormCast documents.
2. **TypeScript Definitions**: Contains `src/schema.ts`, which maps 1:1 with the JSON Schema, ensuring type safety across the entire monorepo.
3. **AST Manipulators**: Contains `src/astManipulators.ts`. All structural changes to a document (inserting nodes, moving nodes, deleting nodes) MUST be performed using these functions.
4. **Validation Scripts**: Contains `scripts/validate-schema.ts`, which ensures the `test.data.ts` always conforms to the `docframe.schema.json`.

## Architectural Boundaries

- **No UI Code**: This package must remain completely framework-agnostic. Do not import React, Next.js, or DOM-specific libraries.
- **Pure Functions**: The AST Manipulator functions must be pure, taking in a document schema and returning a fresh, modified copy.

## Pre-Commit Hooks

- Any changes to `src/schema.ts` MUST be followed by running `pnpm run schema:validate` to re-generate the JSON schema and test it. This is enforced by Husky.
