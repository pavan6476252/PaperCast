# ADR 0001: Extend Table Node for Footers and Static Data

## Context

The current `Table` node exclusively supports dynamically bound arrays of data (`bindPath`). Furthermore, it lacks a mechanism to add a "footer" section (e.g. for totals or summary rows) that can merge cells and host arbitrary draggable widgets. We evaluated whether to introduce a generic `Grid` node vs extending the `Table` node.

## Decision

We will **extend the existing `Table` node** rather than creating a new node type.

1. **Static Data Storage**: The `Table` node will natively support a `data` array in its props, allowing inline data entry for users who want static tables without external data binding.
2. **Table Footers**: The `Table` node will introduce a `footerRows` property to define a footer layout. This footer remains logically part of the table, ensuring it obeys standard table pagination logic.
3. **Cell Merging and Pagination**: The footer layout will support `colSpan` and `rowSpan`. During pagination, if a table footer is split across a page boundary, it will break safely at the current unmerged row (we will explicitly prevent breaking mid-way through a vertically merged cell).

## Consequences

- **Positive**: We get to reuse the table's existing column definitions and pagination engine logic. The user experience remains unified under one "Table" widget in the UI.
- **Negative**: The `Table` schema will become more complex since it has to support two distinct modes of data ingestion (bound vs inline) and a specialized layout region (`footerRows`) with its own constraints.
