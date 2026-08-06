# Dynamic Row Spanning via `mergeBy` Data Paths

We are introducing dynamic `rowSpan` generation for data-bound tables (Value Grouping). Instead of a simple `mergeAdjacentValues` boolean, we decided to use a `mergeBy: string[]` property on `TableColumnConfig`.

A cell will only dynamically merge with the row above it if _every_ data path defined in `mergeBy` evaluates to the exact same value as the previous row.

**Why:**
A simple boolean (or single-key) merge causes false positives when unrelated child entities happen to have identical values (e.g., two unrelated items both costing "$10"). By using an array of paths, we natively support hierarchical grouping (e.g., `mergeBy: ["categoryId", "subcategoryId"]`), ensuring a cell only spans if its parent grouping remains identical. This handles complex data hierarchies accurately without requiring the pagination engine to understand nested trees.
