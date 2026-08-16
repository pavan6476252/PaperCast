type Prev = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
];

export type DotPaths<T, D extends number = 5> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T]-?: K extends string | number
          ? | `${K}`
            | (DotPaths<T[K], Prev[D]> extends infer R
                ? R extends string
                  ? `${K}.${R}`
                  : never
                : never)
          : never;
      }[keyof T]
    : never;

// TData is the generic context passed into the engine
// By default it is loosely typed as Record<string, unknown> to support dynamic builders
export type DefaultTData = Record<string, unknown>;

import { Theme } from "@papercast/core";

export interface PaperCastContext<TData = DefaultTData> {
  data: TData;
  theme?: Theme;
}

/**
 * Map of precise pixel heights for nodes measured via the headless adapter layer.
 * These measurements are required to calculate where page breaks must occur.
 */
export interface Measurements {
  headers: Record<string, number>;
  footers: Record<string, number>;
  blocks: Record<string, number>;
  tableRows: Record<string, number[]>;
  tableFooterRows?: Record<string, number[]>;
  tableHeaders: Record<string, number>;
}
