import React, { useMemo } from "react";
import { useDocumentStore } from "../../store/documentStore";
import { BaseNode } from "@formcast/core";
import {
  Type,
  Image,
  Columns,
  Rows,
  ArrowUpDown,
  LayoutGrid,
  List,
  FileText,
  Settings,
  ListOrdered,
  CheckSquare,
  CircleDot,
  ListChecks,
  Focus,
} from "lucide-react";

const WIDGETS = [
  { type: "text", label: "Text", icon: Type },
  { type: "image", label: "Image", icon: Image },
  { type: "row", label: "Row", icon: Rows },
  { type: "column", label: "Column", icon: Columns },
  { type: "spacer", label: "Spacer", icon: ArrowUpDown },
  { type: "table", label: "Table", icon: LayoutGrid },
  { type: "listTile", label: "List Tile", icon: List },
  { type: "richText", label: "Rich Text", icon: FileText },
  { type: "ul", label: "Unordered List", icon: List },
  { type: "ol", label: "Ordered List", icon: ListOrdered },
  { type: "checkbox", label: "Checkbox", icon: CheckSquare },
  { type: "radio", label: "Radio", icon: CircleDot },
  { type: "radioGroup", label: "Radio Group", icon: ListChecks },
];

export const WidgetsPanel: React.FC = () => {
  const { selectedNodeId, parsedDocument, setRightPanelMode } =
    useDocumentStore();

  const selectedNodeType = useMemo(() => {
    if (!selectedNodeId || !parsedDocument) return null;

    const baseNodeId = selectedNodeId.split("-part")[0];

    const findNode = (node: BaseNode): BaseNode | null => {
      if (node.id === baseNodeId) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findNode(child as BaseNode);
          if (found) return found;
        }
      }
      return null;
    };

    let found: BaseNode | null = null;
    if (parsedDocument.document.body)
      found = findNode(parsedDocument.document.body);
    if (!found && parsedDocument.document.headers) {
      for (const h of Object.values(parsedDocument.document.headers)) {
        if (h.root && !found) found = findNode(h.root);
      }
    }
    if (!found && parsedDocument.document.footers) {
      for (const f of Object.values(parsedDocument.document.footers)) {
        if (f.root && !found) found = findNode(f.root);
      }
    }

    return found?.type || null;
  }, [selectedNodeId, parsedDocument]);

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto text-sm text-gray-800">
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 mb-4">
          {selectedNodeId && (
            <button
              onClick={() => {
                let el = document.querySelector(
                  `#preview-scroll-container [data-node-id="${selectedNodeId}"]`
                );
                if (!el) {
                  const baseNodeId = selectedNodeId.split("-part")[0];
                  el =
                    document.querySelector(
                      `#preview-scroll-container [data-node-id="${baseNodeId}"]`
                    ) ||
                    document.querySelector(
                      `#preview-scroll-container [data-node-id="${baseNodeId}-part1"]`
                    );
                }
                if (el) {
                  const scrollContainer = document.getElementById(
                    "preview-scroll-container"
                  );
                  if (scrollContainer) {
                    const containerRect =
                      scrollContainer.getBoundingClientRect();
                    const elRect = el.getBoundingClientRect();
                    const scrollTopTarget =
                      scrollContainer.scrollTop +
                      (elRect.top - containerRect.top) -
                      containerRect.height / 2 +
                      elRect.height / 2;
                    scrollContainer.scrollTo({
                      top: scrollTopTarget,
                      behavior: "smooth",
                    });
                  } else {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }
              }}
              className="text-gray-400 hover:text-blue-600 transition-colors"
              title="Scroll to element in preview"
            >
              <Focus size={14} />
            </button>
          )}
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            Available Widgets
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {WIDGETS.map((widget) => {
            const isSelectedType = selectedNodeType === widget.type;
            return (
              <div
                key={widget.type}
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    "application/formcast-widget",
                    widget.type
                  );
                  e.dataTransfer.effectAllowed = "copy";
                }}
                className={`
                  flex items-center p-2 border rounded-md cursor-grab transition-colors group
                  ${
                    isSelectedType
                      ? "border-blue-500 bg-blue-50 text-blue-800 shadow-sm"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
                  }
                `}
                title={`Drag to add ${widget.label}`}
              >
                <div className="flex items-center flex-1">
                  <widget.icon
                    size={16}
                    className={
                      isSelectedType
                        ? "text-blue-600 mr-3"
                        : "text-gray-500 mr-3"
                    }
                  />
                  <span className="text-sm font-medium">{widget.label}</span>
                </div>

                {isSelectedType && selectedNodeId && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRightPanelMode("properties");
                    }}
                    className="ml-2 px-2 py-2 rounded-full bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Settings size={13} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
