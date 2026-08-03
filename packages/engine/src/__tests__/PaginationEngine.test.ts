import { describe, it, expect } from "vitest";
import { paginateDocument, Measurements } from "../PaginationEngine";
import { DocumentSchema } from "@formcast/core";

describe("PaginationEngine", () => {
  const createMockSchema = (children: any[]): DocumentSchema => ({
    version: 1,
    meta: { pageSize: "A4", orientation: "portrait", baseUnit: "px", dpi: 96 },
    theme: { defaults: { base: {} } },
    data: {},
    definitions: { widgets: {} },
    document: {
      headers: {},
      footers: {},
      pageOverrides: {},
      body: {
        id: "body-id",
        type: "column",
        layout: {},
        children,
      },
    },
  });

  it("paginates children that fit on a single page", () => {
    const doc = createMockSchema([
      {
        id: "block-1",
        type: "text",
        layout: {},
        props: { literal: "Short block" },
      },
    ]);

    const measurements: Measurements = {
      headers: {},
      footers: {},
      blocks: {
        "block-1": 50,
      },
      tableRows: {},
      tableHeaders: {},
    };

    const pages = paginateDocument(doc, 1000, measurements);

    expect(pages.length).toBe(1);
    expect(pages[0].pageNumber).toBe(1);
    expect(pages[0].bodyNodes.length).toBe(1);
    expect(pages[0].bodyNodes[0].id).toBe("block-1");
  });

  it("splits blocks across multiple pages when they exceed page height", () => {
    const doc = createMockSchema([
      {
        id: "block-1",
        type: "text",
        layout: {},
        props: { literal: "Block 1" },
      },
      {
        id: "block-2",
        type: "text",
        layout: {},
        props: { literal: "Block 2" },
      },
      {
        id: "block-3",
        type: "text",
        layout: {},
        props: { literal: "Block 3" },
      },
    ]);

    const measurements: Measurements = {
      headers: {},
      footers: {},
      blocks: {
        "block-1": 400,
        "block-2": 400, // Should trigger a page break since 400 + 400 > 600 available (excluding paddings)
        "block-3": 400,
      },
      tableRows: {},
      tableHeaders: {},
    };

    // 600 height limit per page
    const pages = paginateDocument(doc, 600, measurements);

    expect(pages.length).toBe(3);

    expect(pages[0].pageNumber).toBe(1);
    expect(pages[0].bodyNodes.length).toBe(1);
    expect(pages[0].bodyNodes[0].id).toBe("block-1");

    expect(pages[1].pageNumber).toBe(2);
    expect(pages[1].bodyNodes.length).toBe(1);
    expect(pages[1].bodyNodes[0].id).toBe("block-2");

    expect(pages[2].pageNumber).toBe(3);
    expect(pages[2].bodyNodes.length).toBe(1);
    expect(pages[2].bodyNodes[0].id).toBe("block-3");
  });
});
