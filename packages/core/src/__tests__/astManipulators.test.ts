import { describe, expect, it } from "vitest";
import {
  deleteNodeFromAst,
  findNodeGlobal,
  insertNodeIntoAst,
  replaceNodeInAst,
} from "../astManipulators";
import { DocumentSchema } from "../schema";

describe("astManipulators", () => {
  const mockDoc: DocumentSchema = {
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
        children: [
          {
            id: "child-1",
            type: "text",
            layout: {},
            props: { literal: "Hello" },
          },
          {
            id: "child-2",
            type: "text",
            layout: {},
            props: { literal: "World" },
          },
        ],
      },
    },
  };

  describe("deleteNodeFromAst", () => {
    it("deletes a node by id and returns a new immutable copy", () => {
      const newDoc = deleteNodeFromAst(mockDoc, "child-1");

      // Original doc is untouched
      expect(mockDoc.document.body.children?.length).toBe(2);
      expect(mockDoc.document.body.children?.[0].id).toBe("child-1");

      // New doc has the node removed
      expect(newDoc.document.body.children?.length).toBe(1);
      expect(newDoc.document.body.children?.[0].id).toBe("child-2");

      // Check deep clone
      expect(newDoc).not.toBe(mockDoc);
      expect(newDoc.document.body).not.toBe(mockDoc.document.body);
    });

    it("returns the same structure if node is not found", () => {
      const newDoc = deleteNodeFromAst(mockDoc, "non-existent-id");
      expect(newDoc).toEqual(mockDoc);
    });
  });

  describe("replaceNodeInAst", () => {
    it("replaces a node and returns a new immutable copy", () => {
      const replacement = {
        id: "child-1",
        type: "text" as const,
        layout: {},
        props: { literal: "Replaced" },
      };
      const newDoc = replaceNodeInAst(mockDoc, "child-1", replacement);

      expect((newDoc.document.body.children?.[0] as any).props?.literal).toBe(
        "Replaced"
      );
      // Original is untouched
      expect((mockDoc.document.body.children?.[0] as any).props?.literal).toBe(
        "Hello"
      );
    });
  });

  describe("insertNodeIntoAst", () => {
    it("inserts a node into a container at a specific index", () => {
      const newNode = {
        id: "child-3",
        type: "text" as const,
        layout: {},
        props: { literal: "!" },
      };
      const newDoc = insertNodeIntoAst(mockDoc, "body-id", newNode, 1);

      expect(newDoc.document.body.children?.length).toBe(3);
      expect(newDoc.document.body.children?.[1].id).toBe("child-3");
    });
  });

  describe("findNodeGlobal", () => {
    it("finds a node by id", () => {
      const result = findNodeGlobal(mockDoc, "child-2");
      expect(result).not.toBeNull();
      expect(result?.node.id).toBe("child-2");
      expect(result?.parentInfo?.parent.id).toBe("body-id");
    });
  });
});
