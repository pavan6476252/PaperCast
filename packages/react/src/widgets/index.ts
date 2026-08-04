import { PaperCastReact } from "../PaperCast";
import { basicNodes } from "../nodes/basicNodes";
import { formNodes } from "../nodes/formNodes";
import { TableNodeDef } from "../nodes/TableNode";

export function registerDefaultWidgets() {
  basicNodes.forEach((nodeDef) => PaperCastReact.registerNode(nodeDef));
  formNodes.forEach((nodeDef) => PaperCastReact.registerNode(nodeDef));
  PaperCastReact.registerNode(TableNodeDef);
}

export * from "../nodes/basicNodes";
export * from "../nodes/formNodes";
export * from "../nodes/TableNode";
