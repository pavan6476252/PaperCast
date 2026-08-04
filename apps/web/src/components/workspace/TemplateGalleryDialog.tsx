import React from "react";
import { SNIPPETS, SchemaSnippet } from "@formcast/core";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useDocumentStore } from "../../store/documentStore";
import { X } from "lucide-react";

export const TemplateGalleryDialog = ({ onClose }: { onClose: () => void }) => {
  const { setActiveSchema, setLastSavedJsonString } = useWorkspaceStore();
  const { setJsonString } = useDocumentStore();

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Template Gallery
            </h2>
            <p className="text-sm text-gray-500">
              Choose a starting point for your new document.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {Object.entries(groupedSnippets).map(([category, snippets]) => (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {snippets.map((snippet) => (
                  <div
                    key={snippet.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer flex flex-col"
                    onClick={() => handleUseTemplate(snippet)}
                  >
                    <h4 className="font-medium text-gray-900 mb-1">
                      {snippet.name}
                    </h4>
                    <p className="text-xs text-gray-500 flex-1 mb-4">
                      {snippet.description}
                    </p>
                    <div className="flex gap-2 mt-auto">
                      {snippet.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
