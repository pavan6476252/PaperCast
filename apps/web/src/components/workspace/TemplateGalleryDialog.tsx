import React from "react";
import { SNIPPETS, SchemaSnippet } from "@papercast/core";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useDocumentStore } from "../../store/documentStore";
import { X } from "lucide-react";
import { useMobileBackHandler } from "../../hooks/useMobileBackHandler";

export const TemplateGalleryDialog = ({ onClose }: { onClose: () => void }) => {
  const { setActiveSchema, setLastSavedJsonString } = useWorkspaceStore();
  const { setJsonString } = useDocumentStore();

  useMobileBackHandler(true, onClose);

  const handleUseTemplate = async (snippet: SchemaSnippet) => {
    const content = JSON.stringify(snippet.schema, null, 2);
    setJsonString(content);
    setActiveSchema(null);
    setLastSavedJsonString(null);
    onClose();
  };

  // Group snippets by category
  const groupedSnippets = SNIPPETS.reduce(
    (acc, snippet) => {
      if (!acc[snippet.category]) {
        acc[snippet.category] = [];
      }
      acc[snippet.category].push(snippet);
      return acc;
    },
    {} as Record<string, typeof SNIPPETS>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] backdrop-blur-sm">
      <div className="bg-background rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Template Gallery
            </h2>
            <p className="text-sm text-foreground/50">
              Choose a starting point for your new document.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-foreground/50 hover:text-foreground rounded-full hover:bg-surface"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-surface/50">
          {Object.entries(groupedSnippets).map(([category, snippets]) => (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-semibold text-foreground/90 mb-4 capitalize">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {snippets.map((snippet) => (
                  <button
                    key={snippet.id}
                    className="bg-background border border-border rounded-lg p-4 hover:border-accent hover:shadow-lg hover:shadow-accent/5 transition-all cursor-pointer flex flex-col text-left"
                    onClick={() => handleUseTemplate(snippet)}
                  >
                    <h4 className="font-medium text-foreground mb-1">
                      {snippet.name}
                    </h4>
                    <p className="text-xs text-foreground/60 flex-1 mb-4">
                      {snippet.description}
                    </p>
                    <div className="flex gap-2 mt-auto">
                      {snippet.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] bg-surface text-foreground/70 px-2 py-0.5 rounded-full border border-border/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
