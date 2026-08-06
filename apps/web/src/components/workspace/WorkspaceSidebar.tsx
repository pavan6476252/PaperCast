import React, { useState, useEffect } from "react";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useDocumentStore } from "../../store/documentStore";
import { TemplateGalleryDialog } from "./TemplateGalleryDialog";
import {
  File,
  Plus,
  Trash2,
  Edit2,
  Download,
  Upload,
  Copy,
  Folder,
} from "lucide-react";

export const WorkspaceSidebar = () => {
  const {
    schemas,
    activeSchemaId,
    loadWorkspace,
    createSchema,
    loadSchemaContent,
    deleteSchema,
    setActiveSchema,
    saveSchema,
    isWorkspaceAutoSave,
    setIsTemplateGalleryOpen,
    setLastSavedJsonString,
  } = useWorkspaceStore();

  const { jsonString, setJsonString } = useDocumentStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  // Auto-save active schema on jsonString change (debounced)
  useEffect(() => {
    if (isWorkspaceAutoSave && activeSchemaId && jsonString) {
      const timeoutId = setTimeout(() => {
        const active = schemas.find((s) => s.id === activeSchemaId);
        if (active) {
          saveSchema(activeSchemaId, active.name, jsonString);
        }
      }, 1000); // 1s debounce

      return () => clearTimeout(timeoutId);
    }
  }, [jsonString, activeSchemaId, saveSchema, schemas, isWorkspaceAutoSave]);

  const handleCreateNew = async () => {
    // Blank template
    const blank = {
      version: 1,
      meta: { pageSize: "A4", orientation: "portrait" },
      theme: { defaults: { base: { fontFamily: "Inter", fontSizePx: 14 } } },
      data: {},
      definitions: { widgets: {} },
      document: {
        headers: {},
        footers: {},
        pageOverrides: {},
        body: {
          id: "root-1",
          type: "root",
          layout: { direction: "column" },
          children: [],
        },
      },
    };
    const content = JSON.stringify(blank, null, 2);
    const id = await createSchema("Untitled Schema", content);
    setJsonString(content);
  };

  const handleSwitchSchema = async (id: string) => {
    const content = await loadSchemaContent(id);
    if (content) {
      setJsonString(content);
      setActiveSchema(id);
      setLastSavedJsonString(content);
    }
  };

  const handleDuplicate = async (id: string) => {
    const content = await loadSchemaContent(id);
    if (content) {
      const active = schemas.find((s) => s.id === id);
      const name = active ? `${active.name} (Copy)` : "Copy";
      const newId = await createSchema(name, content);
      setJsonString(content);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const active = schemas.find((s) => s.id === activeSchemaId);
    const filename = active
      ? `${active.name.replace(/\\s+/g, "_")}.json`
      : "schema.json";

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        JSON.parse(content); // validate JSON
        const id = await createSchema(file.name.replace(".json", ""), content);
        setJsonString(content);
      } catch (err) {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // reset
  };

  return (
    <div className="w-full bg-background border-r border-border flex flex-col h-full print:hidden transition-colors">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground/80 flex items-center gap-2 mb-4">
          <Folder size={16} /> Workspace
        </h2>

        <div className="flex gap-2 mb-2">
          <button
            onClick={handleCreateNew}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 px-2 rounded font-medium flex items-center justify-center gap-1 transition-colors"
          >
            <Plus size={14} /> New
          </button>
          <button
            onClick={() => setIsTemplateGalleryOpen(true)}
            className="flex-1 bg-surface hover:bg-surface/80 text-foreground/80 border border-border text-xs py-1.5 px-2 rounded font-medium flex items-center justify-center gap-1 transition-colors"
          >
            Templates
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex-1 text-foreground/70 hover:text-foreground border border-border bg-surface hover:bg-surface/80 text-xs py-1.5 px-2 rounded flex items-center justify-center gap-1 transition-colors"
            title="Download JSON"
          >
            <Download size={14} /> Export
          </button>
          <label className="flex-1 text-foreground/70 hover:text-foreground border border-border bg-surface hover:bg-surface/80 text-xs py-1.5 px-2 rounded flex items-center justify-center gap-1 cursor-pointer transition-colors">
            <Upload size={14} /> Import
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="text-xs font-medium text-foreground/50 uppercase tracking-wider mb-2 px-2 mt-2">
          Saved Schemas
        </div>

        {schemas.length === 0 ? (
          <div className="text-xs text-foreground/50 italic px-2 text-center mt-4">
            No saved schemas.
          </div>
        ) : (
          <ul className="space-y-1">
            {schemas.map((schema) => {
              const isActive = schema.id === activeSchemaId;
              const isEditing = editingId === schema.id;

              return (
                <li
                  key={schema.id}
                  className={`group rounded-md flex flex-col p-2 cursor-pointer transition-colors ${
                    isActive
                      ? "bg-accent/20 border border-accent/40"
                      : "hover:bg-surface border border-transparent"
                  }`}
                  onClick={() =>
                    !isEditing && !isActive && handleSwitchSchema(schema.id)
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <File
                        size={14}
                        className={
                          isActive ? "text-accent" : "text-foreground/50"
                        }
                      />
                      {isEditing ? (
                        <input
                          autoFocus
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onBlur={() => {
                            if (editName.trim())
                              saveSchema(schema.id, editName, jsonString);
                            setEditingId(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              if (editName.trim())
                                saveSchema(schema.id, editName, jsonString);
                              setEditingId(null);
                            }
                          }}
                          className="text-sm bg-background border border-accent rounded px-1 w-full outline-none text-foreground"
                        />
                      ) : (
                        <span
                          className={`text-sm truncate ${isActive ? "font-medium text-accent" : "text-foreground/80"}`}
                        >
                          {schema.name}
                        </span>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="flex items-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditName(schema.name);
                            setEditingId(schema.id);
                          }}
                          className="p-1 text-foreground/50 hover:text-accent rounded"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicate(schema.id);
                          }}
                          className="p-1 text-foreground/50 hover:text-green-500 rounded"
                        >
                          <Copy size={12} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSchema(schema.id);
                          }}
                          className="p-1 text-foreground/50 hover:text-red-500 rounded"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                  {!isEditing && (
                    <div className="text-[10px] text-foreground/50 pl-6 mt-0.5">
                      {new Date(schema.updatedAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
