import React from "react";
import { BaseNode, Measurements } from "@formcast/core";

export interface MeasureContext {
  availableWidthPx: number;
}

export interface SplitContext {
  data: any;
  measurements?: Measurements; // Strictly typed measurements
}

export interface NodeTypeDefinition<TNode extends BaseNode = BaseNode> {
  type: string;
  measure: (node: TNode, ctx: MeasureContext) => number;
  render: React.ComponentType<{
    node: TNode;
    path?: string;
    isSelected?: boolean;
    onSelect?: (e: React.MouseEvent) => void;
    pageContext?: { pageNumber: number; pageCount: number };
  }>;
  split?: (
    node: TNode,
    remainingHeight: number,
    ctx: SplitContext
  ) => [TNode, TNode | null, number?] | null;
}

class Registry {
  private definitions: Map<string, NodeTypeDefinition<any>> = new Map();

  register<TNode extends BaseNode>(def: NodeTypeDefinition<TNode>) {
    this.definitions.set(def.type, def);
  }

  get(type: string): NodeTypeDefinition<any> | undefined {
    return this.definitions.get(type);
  }
}

export const NodeRegistry = new Registry();
