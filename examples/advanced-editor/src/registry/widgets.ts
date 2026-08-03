import { WidgetRegistryItem } from "./utils";
import { headers } from "./categories/headers";
import { footers } from "./categories/footers";
import { layouts } from "./categories/layouts";
import { tables } from "./categories/tables";
import { advanced } from "./categories/advanced";

export const widgets: WidgetRegistryItem[] = [
  ...headers,
  ...footers,
  ...layouts,
  ...tables,
  ...advanced,
];

export type { WidgetRegistryItem };
