import { FormCastReact } from "../FormCast";
import { basicNodes } from "../nodes/basicNodes";
import { formNodes } from "../nodes/formNodes";
import { TableNodeDef } from "../nodes/TableNode";

export function registerDefaultWidgets() {
  basicNodes.forEach((nodeDef) => FormCastReact.registerNode(nodeDef));
  formNodes.forEach((nodeDef) => FormCastReact.registerNode(nodeDef));
  FormCastReact.registerNode(TableNodeDef);
}

export * from "../nodes/basicNodes";
export * from "../nodes/formNodes";
export * from "../nodes/TableNode";
