import React from "react";
import { usePaperCastEditor, WIDGETS } from "@papercast/react/editor";
import { Settings } from "lucide-react";

export const MobileWidgetsBar = ({
  onSettingsClick,
}: {
  onSettingsClick: () => void;
}) => {
  const { selectedNodeId, document: parsedDocument } = usePaperCastEditor();

  const selectedNodeType = React.useMemo(() => {
    if (!selectedNodeId || !parsedDocument) return null;

    const baseNodeId = selectedNodeId.split("-part")[0];

    const findNode = (node: any): any | null => {
      if (node.id === baseNodeId) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findNode(child);
          if (found) return found;
        }
      }
      return null;
    };

    let found = findNode(parsedDocument.document.body);

    if (!found && parsedDocument.document.headers) {
      for (const header of Object.values(parsedDocument.document.headers)) {
        if ((header as any).root) {
          found = findNode((header as any).root);
          if (found) break;
        }
      }
    }

    if (!found && parsedDocument.document.footers) {
      for (const footer of Object.values(parsedDocument.document.footers)) {
        if ((footer as any).root) {
          found = findNode((footer as any).root);
          if (found) break;
        }
      }
    }

    return found?.type || null;
  }, [selectedNodeId, parsedDocument]);

  return (
    <div className="flex md:hidden items-center w-full bg-surface border-t border-border shadow-[0_-4px_15px_-3px_rgba(0,0,0,0.1)] z-30 relative shrink-0 pb-4 pt-2">
      <div className="flex-1 flex items-center overflow-x-auto px-2 gap-2 hide-scrollbar">
        {WIDGETS.map((widget) => {
          const isSelected = selectedNodeType === widget.type;
          return (
            <div
              key={widget.type}
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  "application/papercast-widget",
                  widget.type
                );
                e.dataTransfer.effectAllowed = "copy";
              }}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-grab shrink-0 shadow-sm transition-colors ${
                isSelected
                  ? "border-accent bg-accent/20 text-accent"
                  : "border-border bg-background text-foreground/80 hover:bg-surface/80"
              }`}
            >
              <widget.icon
                size={16}
                className={isSelected ? "text-accent" : "text-foreground/50"}
              />
              <span className="text-sm font-medium whitespace-nowrap">
                {widget.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="shrink-0 p-2 border-l border-border bg-surface">
        <button
          onClick={onSettingsClick}
          className="p-2 rounded-xl bg-accent text-white hover:bg-accent/90 shadow-sm flex items-center gap-1"
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
};
