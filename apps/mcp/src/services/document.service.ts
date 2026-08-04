import { sendCommandToActiveSession } from "./ws.js";
import { deepMerge, validateAndSend } from "./ast.js";
import { WsEventType } from "@papercast/core/ws";

export async function getDocumentState() {
  const state = await sendCommandToActiveSession({
    type: WsEventType.GET_CURRENT_SCHEMA,
  });
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(state.schema, null, 2),
      },
    ],
  };
}

export async function setDocumentState(schema: any) {
  return validateAndSend(
    schema,
    "Successfully sent validated updated schema layout to browser tab."
  );
}

export async function replaceDocumentBody(children: any[]) {
  const state = await sendCommandToActiveSession({
    type: WsEventType.GET_CURRENT_SCHEMA,
  });
  const newSchema = structuredClone(state.schema);
  newSchema.document.body.children = children;
  return validateAndSend(
    newSchema,
    "Successfully replaced document body children and passed validation."
  );
}

export async function updateDocumentData(data: any) {
  const state = await sendCommandToActiveSession({
    type: WsEventType.GET_CURRENT_SCHEMA,
  });
  const newSchema = structuredClone(state.schema);
  newSchema.data = newSchema.data || {};
  deepMerge(newSchema.data, data);
  return validateAndSend(
    newSchema,
    "Successfully merged new data into document state."
  );
}

export async function setDocumentSection(
  sectionType: "headers" | "footers",
  sectionKey: string,
  sectionData: any
) {
  const state = await sendCommandToActiveSession({
    type: WsEventType.GET_CURRENT_SCHEMA,
  });
  const newSchema = structuredClone(state.schema);
  newSchema.document[sectionType] = newSchema.document[sectionType] || {};
  newSchema.document[sectionType][sectionKey] = sectionData;
  return validateAndSend(
    newSchema,
    `Successfully set document ${sectionType} section: ${sectionKey}`
  );
}

export async function deleteDocumentSection(
  sectionType: "headers" | "footers",
  sectionKey: string
) {
  const state = await sendCommandToActiveSession({
    type: WsEventType.GET_CURRENT_SCHEMA,
  });
  const newSchema = structuredClone(state.schema);
  if (
    newSchema.document[sectionType] &&
    newSchema.document[sectionType][sectionKey]
  ) {
    delete newSchema.document[sectionType][sectionKey];
  }
  return validateAndSend(
    newSchema,
    `Successfully deleted document ${sectionType} section: ${sectionKey}`
  );
}

export async function updateDocumentMeta(patch: any) {
  const state = await sendCommandToActiveSession({
    type: WsEventType.GET_CURRENT_SCHEMA,
  });
  const newSchema = structuredClone(state.schema);
  newSchema.meta = newSchema.meta || {};
  deepMerge(newSchema.meta, patch);
  return validateAndSend(
    newSchema,
    "Successfully merged properties into document.meta."
  );
}

export async function updateDocumentTheme(patch: any) {
  const state = await sendCommandToActiveSession({
    type: "GET_CURRENT_SCHEMA" as any,
  });
  const newSchema = structuredClone(state.schema);
  newSchema.theme = newSchema.theme || {};
  newSchema.theme.defaults = newSchema.theme.defaults || {};
  deepMerge(newSchema.theme.defaults, patch);
  return validateAndSend(
    newSchema,
    "Successfully merged properties into document.theme.defaults."
  );
}
