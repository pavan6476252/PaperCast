import React from "react";
import { TextNode } from "@papercast/core";
import { PropertyGroup, StringProp, CheckboxProp } from "@papercast/react";
import { usePaperCastEditor } from "@papercast/react/editor";
import { resolvePath } from "@papercast/engine";
import { useDocumentStore } from "../../store/documentStore";
import dynamic from "next/dynamic";

const InlineRichTextEditor = dynamic(
  () =>
    import("./InlineRichTextEditor").then((mod) => mod.InlineRichTextEditor),
  {
    ssr: false,
    loading: () => (
      <div className="p-2 text-xs text-foreground/50 border rounded">
        Loading editor...
      </div>
    ),
  }
);

export const TextPropertyEditor: React.FC<{
  node: TextNode;
  handleUpdate: <
    G extends "layout" | "style" | "props" | "bind" | "config",
    K extends string,
  >(
    group: G,
    key: K,
    value: unknown
  ) => void;
  dataPaths: string[];
}> = ({ node, handleUpdate, dataPaths }) => {
  const { replaceNode } = usePaperCastEditor();
  const documentData = useDocumentStore(
    (state) => state.parsedDocument?.data || {}
  );

  return (
    <PropertyGroup title="Text Content">
      <div className="mb-4">
        <StringProp
          label="Data Binding (bind.path)"
          value={node.bind?.path}
          suggestions={dataPaths}
          onChange={(v) => handleUpdate("bind", "path", v)}
          disabled={node.config?.lockContent}
        />
      </div>

      {node.bind?.path && !node.props?.literal && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          <p className="mb-2">
            This text is populated by <strong>{node.bind.path}</strong>. To edit
            it using rich text, convert it to a template.
          </p>
          <button
            onClick={() => {
              const newNode = structuredClone(node);
              if (!newNode.props) newNode.props = {};
              newNode.props.literal = `<p>{{ ${node.bind?.path} }}</p>`;

              if (newNode.bind) {
                delete (newNode.bind as any).path;
                if (Object.keys(newNode.bind).length === 0) {
                  delete newNode.bind;
                }
              }

              replaceNode(node.id, newNode);
            }}
            className="w-full py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-900 rounded border border-yellow-300 font-medium transition-colors"
          >
            Convert to Rich Text Template
          </button>
        </div>
      )}

      {node.bind?.path && node.props?.literal && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800">
          <p>
            <strong>Warning:</strong> The <code>bind.path</code> is being
            ignored because this node also has Rich Text content. Remove one or
            the other.
          </p>
        </div>
      )}

      {node.props?.literal &&
        /\{\{\s*([^}]+)\s*\}\}/.test(node.props.literal) && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
            <p className="mb-2">
              This text contains template variables (e.g.,{" "}
              <code>{"{{ variable }}"}</code>).
            </p>
            <button
              onClick={() => {
                const newNode = structuredClone(node);
                if (newNode.props?.literal) {
                  newNode.props.literal = newNode.props.literal.replace(
                    /\{\{\s*([^}]+)\s*\}\}/g,
                    (match, path) => {
                      const trimmed = path.trim();
                      const val = resolvePath(documentData, trimmed);
                      return val !== undefined ? String(val) : match;
                    }
                  );
                }
                replaceNode(node.id, newNode);
              }}
              className="w-full py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded border border-blue-300 font-medium transition-colors"
            >
              Resolve Templates to Plain Text
            </button>
          </div>
        )}

      <div className="mb-4">
        <CheckboxProp
          label="Auto-Deconstruct HTML"
          value={node.config?.autoDeconstruct}
          onChange={(v) => handleUpdate("config", "autoDeconstruct", v)}
          labelWidth="w-36"
        />
        <p className="text-[10px] text-foreground/50 mt-1">
          If this text contains HTML, automatically parse it into AST nodes for
          pagination.
        </p>
      </div>

      <div className="flex flex-col text-sm group mt-1">
        <label className="text-foreground/70 mb-1 text-xs font-medium flex justify-between">
          <span>Rich Text</span>
        </label>
        <InlineRichTextEditor
          value={node.props?.literal || ""}
          onChange={(v) => handleUpdate("props", "literal", v)}
          lockContent={node.config?.lockContent}
        />
      </div>
    </PropertyGroup>
  );
};
