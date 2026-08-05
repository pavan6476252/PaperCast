---
name: ui-consistency-guidelines
description: Enforce PaperCast UI and UX consistency using pure CSS and Tailwind. Use when building or reviewing UI components to ensure they align with the project's design system.
---

# UI Consistency Guidelines

When building or reviewing UI components for PaperCast, you MUST strictly adhere to the following UI and UX guidelines. This ensures a consistent, premium feel across the entire application.

## 1. Design System & CSS Variables

PaperCast relies on a set of core CSS variables defined in `apps/web/src/app/globals.css`.

- **Never use hardcoded hex values** (e.g., `#ffffff`, `#171717`) in your styles or Tailwind classes.
- Always use the semantic CSS variables provided:
  - `--background`: Main page background.
  - `--foreground`: Primary text color.
  - `--surface`: Card or elevated container backgrounds.
  - `--border`: Standard border color.
  - `--accent`: Primary brand/action color.

In Tailwind v4, these are available as standard colors if configured, but generally, use them as `var(--background)`, `var(--foreground)`, etc., or via their mapped Tailwind utilities if applicable (e.g., `bg-background`, `text-foreground`).

## 2. Styling Approach (Tailwind CSS)

PaperCast does **NOT** use external component libraries like Shadcn/ui, Radix, MUI, or Chakra.

- All styling must be done using **pure CSS** with **Tailwind CSS as a helper**.
- Prefer utility classes for layout, spacing, and typography.
- For complex, repetitive, or highly custom UI elements, write pure CSS in `globals.css` or scoped CSS modules if appropriate.

## 3. Dark Mode Compliance

The application supports dark mode via the `.dark` class.

- Always ensure your UI components respond correctly to dark mode.
- Since CSS variables (e.g., `--background`, `--surface`) automatically update in `.dark` mode (see `globals.css`), relying on them is the preferred way to support dark mode.
- Avoid using hardcoded `dark:` Tailwind classes unless you are overriding a specific utility that isn't covered by the CSS variables.

## 4. Animations & Micro-interactions

To maintain a premium, dynamic feel, utilize the custom animations defined in `globals.css` under the `@theme inline` block:

- `animate-fade-in-up`
- `animate-fade-in`
- `animate-blob`
- `animate-gradient-x`
- `animate-float-fade`
- `animate-shimmer`

Use these for entrance animations, loading states, and background effects. Add smooth transitions (`transition-all duration-200 ease-in-out`) to all interactive elements (buttons, links, inputs) for hover and focus states.

## 5. Component Reuse

Before creating a new UI component from scratch (e.g., a custom button or input), check `apps/web/src/components` to see if a reusable primitive already exists. If one exists, use it. If not, build it cleanly using the rules above.

## 6. Accessibility (A11y)

Maintain baseline accessibility:

- All interactive elements must have visible focus states (e.g., `focus-visible:ring`).
- Use semantic HTML (`<button>`, `<a>`, `<nav>`, `<main>`).
- Ensure sufficient color contrast.
