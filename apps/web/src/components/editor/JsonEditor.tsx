import React, { useRef, useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useDocumentStore } from "../../store/documentStore";
import docframeSchema from "@papercast/core/schema.json";
import { Save, RefreshCw } from "lucide-react";
import { getNodeContextPaths } from "../../utils/dataBinding";
import { useTheme } from "next-themes";

export const JsonEditor: React.FC = () => {
  const monaco = useMonaco();
  const editorRef = useRef<any>(null);
  const { resolvedTheme } = useTheme();

  const jsonString = useDocumentStore((state) => state.jsonString);
  const setJsonString = useDocumentStore((state) => state.setJsonString);
  const isAutoSync = useDocumentStore((state) => state.isAutoSync);
  const toggleAutoSync = useDocumentStore((state) => state.toggleAutoSync);
  const triggerManualSync = useDocumentStore(
    (state) => state.triggerManualSync
  );
  const parsedDocument = useDocumentStore((state) => state.parsedDocument);
  const lastVisualEdit = useDocumentStore((state) => state.lastVisualEdit);

  const selectedNodeId = useDocumentStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useDocumentStore(
    (state) => state.setSelectedNodeId
  );

  // Track if a selection change was initiated by the editor or externally
  const isEditorInitiatedSelection = useRef(false);

  // Suppress harmless Monaco cancelation errors that occur during fast re-renders
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason &&
        event.reason.type === "cancelation" &&
        event.reason.msg === "operation is manually canceled"
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () =>
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
  }, []);

  // Configure JSON Schema validation and autocomplete
  useEffect(() => {
    if (monaco) {
      (monaco.languages.json as any).jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [
          {
            uri: "http://internal/docframe-schema.json",
            fileMatch: ["*"],
            schema: docframeSchema,
          },
        ],
      });

      const disposable = monaco.languages.registerCompletionItemProvider(
        "json",
        {
          triggerCharacters: ['"'],
          provideCompletionItems: (model: any, position: any) => {
            const textUntilPosition = model.getValueInRange({
              startLineNumber: position.lineNumber,
              startColumn: 1,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            });

            const word = model.getWordUntilPosition(position);
            const range = {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endColumn: word.endColumn,
            };

            // Basic heuristic: are we inside a "path": "..." string?
            if (textUntilPosition.match(/"path"\s*:\s*"/)) {
              const dataKeys = parsedDocument?.data
                ? Object.keys(parsedDocument.data)
                : [];
              const suggestions = dataKeys.map((key) => ({
                label: key,
                kind: monaco.languages.CompletionItemKind.Field,
                insertText: key,
                detail: `Data binding field: ${key}`,
                range: range,
              }));

              return { suggestions };
            }
            return { suggestions: [] };
          },
        }
      );

      return () => disposable.dispose();
    }
  }, [monaco, parsedDocument?.data]);

  // Sync selection from Preview -> Editor
  useEffect(() => {
    if (
      selectedNodeId &&
      editorRef.current &&
      monaco &&
      !isEditorInitiatedSelection.current
    ) {
      const editor = editorRef.current;
      const model = editor.getModel();
      if (!model) return;

      const matches = model.findMatches(
        `"id"\\s*:\\s*"${selectedNodeId}"`,
        false,
        true, // isRegex
        false, // matchCase
        null, // wordSeparators
        true // captureMatches
      );

      if (matches && matches.length > 0) {
        const match = matches[0];
        editor.revealLineInCenter(match.range.startLineNumber);

        // Add a temporary highlight decoration
        const decorations = editor.createDecorationsCollection([
          {
            range: match.range,
            options: {
              isWholeLine: true,
              className: "bg-blue-900/30",
              marginClassName: "bg-blue-500",
            },
          },
        ]);

        setTimeout(() => {
          decorations.clear();
        }, 1500);
      }
    }

    // Reset the flag
    isEditorInitiatedSelection.current = false;
  }, [selectedNodeId, monaco]);

  // Handle visual edits (sync from PropertyPanel -> Editor)
  useEffect(() => {
    if (lastVisualEdit && editorRef.current) {
      const editor = editorRef.current;
      const model = editor.getModel();
      if (model && model.getValue() !== lastVisualEdit.newString) {
        // Save view state to prevent cursor/scroll jumping
        const viewState = editor.saveViewState();

        // Push to undo stack
        editor.pushUndoStop();
        editor.executeEdits("visual-panel", [
          {
            range: model.getFullModelRange(),
            text: lastVisualEdit.newString,
          },
        ]);
        editor.pushUndoStop();

        if (viewState) {
          editor.restoreViewState(viewState);
        }
      }
    }
  }, [lastVisualEdit]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Add Ctrl+S / Cmd+S shortcut
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      triggerManualSync();
    });

    // Register Autocomplete for srcBind and path
    monaco.languages.registerCompletionItemProvider("json", {
      triggerCharacters: ['"'],
      provideCompletionItems: (model: any, position: any) => {
        const lineContent = model.getLineContent(position.lineNumber);
        const textUntilPosition = lineContent.substring(0, position.column - 1);

        // Check if we are inside a "srcBind" or "path" value string
        const match = textUntilPosition.match(
          /"(srcBind|path)"\s*:\s*"([^"]*)$/
        );
        if (!match) return { suggestions: [] };

        // Heuristic: search upwards to find the closest "id"
        let foundId = null;
        for (
          let i = position.lineNumber;
          i >= Math.max(1, position.lineNumber - 50);
          i--
        ) {
          const content = model.getLineContent(i);
          const idMatch = content.match(/"id"\s*:\s*"([^"]+)"/);
          if (idMatch) {
            foundId = idMatch[1];
            break;
          }
        }

        const parsedDocument = useDocumentStore.getState().parsedDocument;
        if (!parsedDocument || !foundId) return { suggestions: [] };

        const paths = getNodeContextPaths(parsedDocument, foundId);

        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions = paths.map((p) => ({
          label: p,
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: p,
          range,
        }));

        return { suggestions };
      },
    });

    // Listen for cursor changes to sync Editor -> Preview
    editor.onDidChangeCursorSelection((e: any) => {
      // Don't trigger if this change was caused by code (e.g. formatting)
      if (e.reason === monaco.editor.CursorChangeReason.Explicit) {
        const model = editor.getModel();
        const currentLine = e.selection.startLineNumber;

        // Simple heuristic: search upwards to find the closest "id"
        let foundId = null;
        for (let i = currentLine; i >= Math.max(1, currentLine - 50); i--) {
          const lineContent = model.getLineContent(i);
          const match = lineContent.match(/"id"\s*:\s*"([^"]+)"/);
          if (match) {
            foundId = match[1];
            break;
          }
          // Stop searching up if we hit a closing bracket that might mean we left the scope
          // (This is rudimentary and could be improved with AST)
        }

        if (foundId) {
          isEditorInitiatedSelection.current = true;
          setSelectedNodeId(foundId);
        }
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-surface border-r border-border">
      {/* Editor Toolbar */}
      <div className="h-12 border-b border-border flex items-center px-4 justify-between shrink-0 bg-background">
        <span className="text-sm font-semibold text-foreground/70">
          docframe.json
        </span>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleAutoSync}
            className={`flex items-center space-x-1 text-xs px-2 py-1 rounded transition-colors ${
              isAutoSync
                ? "bg-accent/20 text-accent"
                : "bg-background text-foreground/70 hover:bg-surface border border-border"
            }`}
          >
            <RefreshCw
              size={14}
              className={isAutoSync ? "animate-spin-slow" : ""}
            />
            <span>{isAutoSync ? "Auto-Sync ON" : "Auto-Sync OFF"}</span>
          </button>

          {!isAutoSync && (
            <button
              onClick={triggerManualSync}
              className="flex items-center space-x-1 text-xs px-3 py-1 bg-accent hover:opacity-90 text-white rounded transition-colors"
              title="Manual Sync (Ctrl+S)"
            >
              <Save size={14} />
              <span>Save & Sync</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="json"
          theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
          value={jsonString}
          onChange={(val) => setJsonString(val || "")}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            wordWrap: "on",
            formatOnPaste: true,
            tabSize: 2,
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
};
