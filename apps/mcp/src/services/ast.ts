import Ajv from "ajv";
import addFormats from "ajv-formats";
import { findNodeGlobal } from "@papercast/core";
// to-replace
import { WsEventType } from "@papercast/core/ws";
// to-replace
import papercastSchema from "@papercast/core/schema.json";
import { fireCommandToActiveSession } from "./ws.js";

const ajv = new Ajv({ allErrors: false, strict: false });
addFormats(ajv);
export const validatePapercast = ajv.compile(papercastSchema);

export function isObject(item: any) {
  return item && typeof item === "object" && !Array.isArray(item);
}

export function deepMerge(target: any, source: any) {
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return target;
}

export function patchNodeProperties(schema: any, nodeId: string, patch: any) {
  const newSchema = structuredClone(schema);
  const result = findNodeGlobal(newSchema, nodeId);
  if (!result) throw new Error(`Node ${nodeId} not found`);

  if (patch.style) result.node.style = { ...result.node.style, ...patch.style };
  if (patch.layout)
    result.node.layout = { ...result.node.layout, ...patch.layout };
  if (patch.props) result.node.props = { ...result.node.props, ...patch.props };
  if (patch.bind) result.node.bind = { ...result.node.bind, ...patch.bind };

  return newSchema;
}

export function validateAndSend(schema: any, successMessage: string) {
  const isValid = validatePapercast(schema);
  if (!isValid) {
    const topErrors = validatePapercast.errors
      ?.slice(0, 10)
      .map((e: any) => `${e.instancePath}: ${e.message}`)
      .join("\n");
    throw new Error(`Schema validation failed. Top 10 errors:\n${topErrors}`);
  }
  fireCommandToActiveSession({
    type: WsEventType.UPDATE_SCHEMA,
    payload: schema,
  });
  return {
    content: [{ type: "text" as const, text: successMessage }],
  };
}
