import React from "react";
import { AnyNode } from "@formcast/core";
import { SchemaRegistry, SchemaTypeDefinition } from "@formcast/engine";

export interface ComponentTypeDefinition<
  TNode extends AnyNode = AnyNode,
> extends SchemaTypeDefinition<TNode> {
  render: React.ComponentType<{
    node: TNode;
    path?: string;
    pageContext?: { pageNumber: number; pageCount: number };
    injectedProps?: React.HTMLAttributes<HTMLDivElement> & {
      "data-selected"?: boolean;
    };
  }>;
}

class Registry {
  private definitions: Map<string, ComponentTypeDefinition<any>> = new Map();

  register<TNode extends AnyNode>(def: ComponentTypeDefinition<TNode>) {
    this.definitions.set(def.type, def);
    // Proxy the schema-relevant parts to the headless engine
    SchemaRegistry.register({
      type: def.type,
      measure: def.measure,
      split: def.split,
    });
  }

  get(type: string): ComponentTypeDefinition<any> | undefined {
    return this.definitions.get(type);
  }
}

export const NodeRegistry = new Registry();
