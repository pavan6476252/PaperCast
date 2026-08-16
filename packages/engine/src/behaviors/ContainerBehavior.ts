import { AnyNode } from "@papercast/core";
import { SchemaRegistry, MeasureContext, SplitContext } from "../registry";

function parseSize(val: number | string | undefined): number {
  if (val === undefined) return 0;
  if (typeof val === "number") return val;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
}

export const ContainerBehavior = {
  measure: <T extends AnyNode>(node: T, ctx: MeasureContext): number => {
    if (!node.children || node.children.length === 0) return 0;
    if (!ctx.measurements || !ctx.getNodeHeight) return 0;

    const layout = node.layout || {};
    const rowGap = parseSize(layout.rowGap);
    const marginTop = parseSize(layout.marginTop);
    const marginBottom = parseSize(layout.marginBottom);
    const paddingTop = parseSize(layout.paddingTop);
    const paddingBottom = parseSize(layout.paddingBottom);

    const isHorizontal = node.type === "row";

    if (isHorizontal) {
      let maxHeight = 0;
      for (let i = 0; i < node.children.length; i++) {
        maxHeight = Math.max(
          maxHeight,
          ctx.getNodeHeight(node.children[i], ctx.measurements)
        );
      }
      return maxHeight + marginTop + marginBottom + paddingTop + paddingBottom;
    } else {
      let heightSum = 0;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const childHeight = ctx.getNodeHeight(child, ctx.measurements);
        heightSum += (i > 0 ? rowGap : 0) + childHeight;
      }
      return heightSum + marginTop + marginBottom + paddingTop + paddingBottom;
    }
  },

  split: <T extends AnyNode>(
    node: T,
    remainingHeight: number,
    ctx: SplitContext
  ): [T, T | null, number?] | null => {
    if (!node.children || node.children.length === 0) return null;
    if (!ctx.measurements || !ctx.getNodeHeight) return null;

    const originalId = node.id.split("-part")[0];
    const children = node.children;

    let currentHeight = 0;
    let splitIndex = 0;
    let fitsAtLeastOne = false;

    const layout = node.layout || {};
    const rowGap = layout.rowGap || 0;

    let splitChildChunk1: AnyNode | null = null;
    let splitChildChunk2: AnyNode | null = null;
    // let splitChildHeight = 0;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childHeight = ctx.getNodeHeight(child, ctx.measurements);

      const addedHeight = i > 0 ? rowGap + childHeight : childHeight;

      if (currentHeight + addedHeight <= remainingHeight) {
        currentHeight += addedHeight;
        splitIndex = i + 1;
        fitsAtLeastOne = true;
      } else {
        // Try to split the child itself recursively
        const def = SchemaRegistry.get(child.type);
        const childSplitFn =
          def?.split ||
          (child.children && child.children.length > 0
            ? ContainerBehavior.split
            : undefined);

        if (childSplitFn) {
          const childRemaining =
            remainingHeight - currentHeight - (i > 0 ? rowGap : 0);
          if (childRemaining > 0) {
            const childSplitResult = childSplitFn(child, childRemaining, ctx);
            if (childSplitResult) {
              const [cChunk1, cChunk2, cChunk1Height] = childSplitResult;
              splitChildChunk1 = cChunk1;
              splitChildChunk2 = cChunk2;
              // splitChildHeight = cChunk1Height ?? 0;

              currentHeight += (i > 0 ? rowGap : 0) + (cChunk1Height ?? 0);
              splitIndex = i; // The boundary is AT this child
              fitsAtLeastOne = true;
            }
          }
        }
        break;
      }
    }

    if (!fitsAtLeastOne) {
      return null;
    }

    if (splitIndex === children.length && !splitChildChunk1) {
      return [node, null, currentHeight];
    }

    const partNumber = (parseInt(node.id.split("-part")[1]) || 1) + 1;
    const chunk1Children = children.slice(0, splitIndex);
    const chunk2Children = children.slice(splitIndex);

    if (splitChildChunk1 && splitChildChunk2) {
      chunk1Children.push(splitChildChunk1);
      chunk2Children[0] = splitChildChunk2;
    }

    const chunk1: T = {
      ...node,
      id: `${originalId}-part${partNumber - 1}`,
      children: chunk1Children,
    };

    const chunk2: T = {
      ...node,
      id: `${originalId}-part${partNumber}`,
      children: chunk2Children,
    };

    if (chunk2.layout) {
      chunk2.layout = { ...chunk2.layout, marginTop: 0, paddingTop: 0 };
    }
    if (chunk1.layout) {
      chunk1.layout = { ...chunk1.layout, marginBottom: 0, paddingBottom: 0 };
    }

    return [chunk1, chunk2, currentHeight];
  },
};
