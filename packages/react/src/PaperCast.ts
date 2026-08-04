import { NodeRegistry, ComponentTypeDefinition } from "./registry";
import { AnyNode } from "@papercast/core";

/**
 * Top-level React API namespace for PaperCast configuration.
 */
export const PaperCastReact = {
  /**
   * Registers a custom component definition globally so it can be rendered by the NodeRenderer.
   * @param def - The React component definition matching a node type.
   */
  registerNode: <TNode extends AnyNode>(
    def: ComponentTypeDefinition<TNode>
  ) => {
    NodeRegistry.register(def);
  },
};
