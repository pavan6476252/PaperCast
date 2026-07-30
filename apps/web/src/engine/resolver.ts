import { DocumentSchema } from "@formcast/core";

export function resolveHeader(
  pageNumber: number,
  totalPages: number, // often we don't know totalPages until pagination finishes, but we can pass Infinity or evaluate "last" in a second pass
  doc: DocumentSchema["document"]
): string | undefined {
  // 1. Check page overrides
  const override = doc.pageOverrides?.[pageNumber.toString()]?.headerId;
  if (override !== undefined) {
    if (override === null) return undefined;
    return override;
  }

  const entries = Object.entries(doc.headers || {});

  // 2. Evaluate conditions by priority: first/last > even/odd > all
  let matchedKey: string | undefined = undefined;

  if (pageNumber === 1) {
    matchedKey = entries.find(([_, h]) => h.condition === "first")?.[0];
  } else if (pageNumber === totalPages) {
    matchedKey = entries.find(([_, h]) => h.condition === "last")?.[0];
  }

  if (!matchedKey) {
    const isEven = pageNumber % 2 === 0;
    matchedKey = entries.find(
      ([_, h]) => h.condition === (isEven ? "even" : "odd")
    )?.[0];
  }

  if (!matchedKey) {
    matchedKey = entries.find(
      ([_, h]) => h.condition === "all" || !h.condition
    )?.[0];
  }

  // 3. Fallback to default
  if (!matchedKey && doc.headerDefaultId) {
    return doc.headerDefaultId;
  }

  return matchedKey;
}

export function resolveFooter(
  pageNumber: number,
  totalPages: number,
  doc: DocumentSchema["document"]
): string | undefined {
  // 1. Check page overrides
  const override = doc.pageOverrides?.[pageNumber.toString()]?.footerId;
  if (override !== undefined) {
    if (override === null) return undefined;
    return override;
  }

  const entries = Object.entries(doc.footers || {});

  // 2. Evaluate conditions by priority: first/last > even/odd > all
  let matchedKey: string | undefined = undefined;

  if (pageNumber === 1) {
    matchedKey = entries.find(([_, h]) => h.condition === "first")?.[0];
  } else if (pageNumber === totalPages) {
    matchedKey = entries.find(([_, h]) => h.condition === "last")?.[0];
  }

  if (!matchedKey) {
    const isEven = pageNumber % 2 === 0;
    matchedKey = entries.find(
      ([_, h]) => h.condition === (isEven ? "even" : "odd")
    )?.[0];
  }

  if (!matchedKey) {
    matchedKey = entries.find(
      ([_, h]) => h.condition === "all" || !h.condition
    )?.[0];
  }

  // 3. Fallback to default
  if (!matchedKey && doc.footerDefaultId) {
    return doc.footerDefaultId;
  }

  return matchedKey;
}
