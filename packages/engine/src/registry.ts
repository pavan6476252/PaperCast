import { AnyNode } from "@papercast/core";
import { Measurements, DefaultTData } from "./types";

export interface MeasureContext {
  availableWidthPx: number;
  measurements: Measurements;
  getNodeHeight: (node: AnyNode, measurements: Measurements) => number;
}

export interface SplitContext {
  data: DefaultTData;
  measurements: Measurements;
  getNodeHeight: (node: AnyNode, measurements: Measurements) => number;
}

/**
 * Defines the physical layout logic for a specific node type, independently
 * of how it is rendered to the DOM.
 */
export interface SchemaTypeDefinition<TNode extends AnyNode = AnyNode> {
  /** The string identifier of the node (e.g., 'table', 'row'). */
  type: string;

  /**
   * Calculates the exact pixel height of the node based on current measurements.
   * Container nodes should recursively sum the heights of their children.
   */
  measure: (node: TNode, ctx: MeasureContext) => number;

  /**
   * Evaluates if and how a node can be split when it exceeds the remaining page height.
   * Returns a tuple of [fittingChunk, remainingChunk, exactHeightOfFittingChunk] or null if unsplittable.
   */
  split?: (
    node: TNode,
    remainingHeight: number,
    ctx: SplitContext
  ) => [TNode, TNode | null, number?] | null;

  /**
   * Generates a strongly-typed default instance of this node type.
   * Provides default styling, children, or literal props out of the box.
   */
  createDefaultNode?: (id: string) => TNode;
}

/**
 * Internal registry that maps node types to their headless measurement
 * and pagination behaviors.
 */
class Registry {
  private definitions: Map<string, SchemaTypeDefinition<any>> = new Map();

  /**
   * Registers a node schema definition with its respective measurement and splitting behavior.
   * @param def - The schema definition containing `measure` and `split` implementations.
   */
  register<TNode extends AnyNode>(def: SchemaTypeDefinition<TNode>) {
    this.definitions.set(def.type, def);
  }

  /**
   * Retrieves a node schema definition by its type identifier.
   * @param type - The string type identifier (e.g. "row", "table").
   */
  get<TNode extends AnyNode = AnyNode>(
    type: string
  ): SchemaTypeDefinition<TNode> | undefined {
    return this.definitions.get(type);
  }
}

/**
 * Global singleton registry for configuring how nodes are measured and split
 * across pages by the PaginationEngine. This is entirely decoupled from the UI framework.
 */
export const SchemaRegistry = new Registry();
