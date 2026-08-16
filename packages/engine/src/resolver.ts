import { DocumentSchema, PageRegion, RegionCondition } from "@papercast/core";
import { DotPaths, DefaultTData } from "./types";

import jexl from "jexl";

export function resolvePath<TData = DefaultTData>(
  obj: TData,
  path: DotPaths<TData> | (string & {})
): any {
  if (!path) return undefined;
  const keys = path.split(".");
  let current: any = obj;
  for (const key of keys) {
    if (current === null || current === undefined) return undefined;
    current = current[key];
  }
  return current;
}

type ConditionEvaluator = (
  pageNumber: number,
  totalPages: number,
  expression?: string
) => boolean;

const conditionStrategies: Record<string, ConditionEvaluator> = {
  first: (pageNumber) => pageNumber === 1,
  last: (pageNumber, totalPages) => pageNumber === totalPages,
  even: (pageNumber) => pageNumber % 2 === 0,
  odd: (pageNumber) => pageNumber % 2 !== 0,
  all: () => true,
  custom: (pageNumber, totalPages, expression) => {
    if (!expression) return false;
    try {
      return Boolean(jexl.evalSync(expression, { pageNumber, totalPages }));
    } catch (e) {
      console.warn("Error evaluating custom condition:", expression, e);
      return false;
    }
  },
};

function evaluateCondition(
  condition: RegionCondition | undefined,
  pageNumber: number,
  totalPages: number
): boolean {
  if (!condition) return true; // Default to 'all' if omitted

  if (typeof condition === "string") {
    const strategy = conditionStrategies[condition];
    return strategy ? strategy(pageNumber, totalPages) : false;
  }

  if (condition.type === "custom") {
    return conditionStrategies.custom(
      pageNumber,
      totalPages,
      condition.expression
    );
  }

  return false;
}

export function resolvePageRegion(
  regionType: "header" | "footer",
  pageNumber: number,
  totalPages: number,
  doc: DocumentSchema["document"]
): string | undefined {
  const regions: Record<string, PageRegion> =
    regionType === "header" ? doc.headers || {} : doc.footers || {};
  const overrides = doc.pageOverrides?.[pageNumber.toString()] || {};
  const overrideId = overrides[`${regionType}Id`];

  // 1. Check page overrides
  if (overrideId !== undefined) {
    if (overrideId === null) return undefined;
    return overrideId;
  }

  const entries = Object.entries(regions);

  // 2. Evaluate conditions by priority: first/last > even/odd > all/custom
  const priorityOrder = ["first", "last", "even", "odd", "custom", "all"];

  for (const priority of priorityOrder) {
    const match = entries.find(([_, region]) => {
      const cond = region.condition || "all";
      const condType = typeof cond === "string" ? cond : cond.type;

      if (condType === priority) {
        return evaluateCondition(cond, pageNumber, totalPages);
      }
      return false;
    });

    if (match) return match[0];
  }

  return undefined;
}
