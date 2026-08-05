import React, { useState, useEffect } from "react";
import { OffscreenMeasurer } from "@papercast/react";
import { DocumentSchema } from "@papercast/core";
import { EditorNodeWrapper } from "./EditorNodeWrapper";
import { useDocumentStore } from "../../store/documentStore";
import { useDocumentPagination } from "../../hooks/useDocumentPagination";
import { PreviewToolbar, PreviewTab } from "./PreviewToolbar";
import { PreviewCanvas } from "./PreviewCanvas";

interface DocumentPreviewProps {
  isEditorVisible?: boolean;
  onToggleEditor?: () => void;
  onToggleWorkspace?: () => void;
  schemaData?: DocumentSchema | null;
  hideToolbar?: boolean;
  zoom?: number;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  isEditorVisible = true,
  onToggleEditor,
  onToggleWorkspace,
  schemaData,
  hideToolbar = false,
  zoom: controlledZoom,
}) => {
  const isReadOnly = !!schemaData;
  const nodeWrapper = isReadOnly ? undefined : EditorNodeWrapper;

  const [activeTab, setActiveTab] = useState<PreviewTab>("content");

  const setJsonString = useDocumentStore((state) => state.setJsonString);
  const storeZoom = useDocumentStore((state) => state.zoom);
  const setZoom = useDocumentStore((state) => state.setZoom);

  const zoom = controlledZoom !== undefined ? controlledZoom : storeZoom;
  const addHeader = useDocumentStore((state) => state.addHeader);
  const addFooter = useDocumentStore((state) => state.addFooter);

  const {
    parsedDocument,
    isValid,
    jsonString,
    pages,
    width,
    height,
    pageSize,
    orientation,
    isSaving,
    handleMeasure,
    handleDownloadPdf,
  } = useDocumentPagination({ schemaData });

  const updateMeta = (updates: any) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.meta) parsed.meta = {};
      parsed.meta = { ...parsed.meta, ...updates };
      setJsonString(JSON.stringify(parsed, null, 2));
    } catch {
      // ignore JSON parse error while typing
    }
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (controlledZoom !== undefined) return;
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      const availableWidth = window.innerWidth - 32; // 16px padding on sides
      if (width > availableWidth) {
        setZoom(availableWidth / width);
      }
    }
  }, [width, setZoom, controlledZoom]); // Run when width changes (or initial mount)

  if (!parsedDocument) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        No valid document.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-surface overflow-hidden">
      <style>
        {`
          @media print {
            @page {
              size: ${
                typeof pageSize === "object"
                  ? `${width}px ${height}px`
                  : `${pageSize} ${orientation === "landscape" ? "landscape" : "portrait"}`
              };
              margin: 0;
            }
          }
        `}
      </style>
      <OffscreenMeasurer
        document={parsedDocument}
        pageWidth={width}
        onMeasure={handleMeasure}
      />

      {!hideToolbar && (
        <PreviewToolbar
          isEditorVisible={isEditorVisible}
          onToggleEditor={onToggleEditor}
          onToggleWorkspace={onToggleWorkspace}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isValid={isValid}
          isSaving={isSaving}
          handleDownload={handleDownloadPdf}
          handlePrint={handlePrint}
          pageSize={pageSize}
          orientation={orientation}
          updateMeta={updateMeta}
          isReadOnly={isReadOnly}
        />
      )}

      <PreviewCanvas
        parsedDocument={parsedDocument}
        pages={pages}
        activeTab={activeTab}
        zoom={zoom}
        width={width}
        height={height}
        nodeWrapper={nodeWrapper}
        addHeader={addHeader}
        addFooter={addFooter}
      />
    </div>
  );
};
