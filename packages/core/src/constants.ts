export const PAGE_SIZES = {
  A4: { width: 794, height: 1123 },
  A3: { width: 1123, height: 1587 },
  Letter: { width: 816, height: 1056 },
} as const;

export type PageSizeName = keyof typeof PAGE_SIZES;
