import { useState, useCallback, useRef, useEffect } from "react";
import { useDocumentStore } from "../store/documentStore";
import { DocumentSchema, PAGE_SIZES } from "@papercast/core";
import { Measurements, paginateDocument, PageData } from "@papercast/engine";

interface UseDocumentPaginationOptions {
  schemaData?: DocumentSchema | null;
}

export function useDocumentPagination({
  schemaData,
}: UseDocumentPaginationOptions = {}) {
  const storeParsedDocument = useDocumentStore((state) => state.parsedDocument);
  const storeIsValid = useDocumentStore((state) => state.isValid);
  const storeJsonString = useDocumentStore((state) => state.jsonString);

  const parsedDocument = schemaData || storeParsedDocument;
  const isValid = schemaData ? true : storeIsValid;
  const jsonString = schemaData
    ? JSON.stringify(schemaData, null, 2)
    : storeJsonString;

  const [pages, setPages] = useState<PageData[] | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Extract meta for page sizing
  const meta = parsedDocument?.meta || {
    pageSize: "A4",
    orientation: "portrait",
  };
  const { pageSize, orientation } = meta;

  let width: number = 794;
  let height: number = 1123;

  if (typeof pageSize === "object") {
    ({ widthPx: width, heightPx: height } = pageSize);
  } else if (PAGE_SIZES[pageSize as keyof typeof PAGE_SIZES]) {
    ({ width, height } = PAGE_SIZES[pageSize as keyof typeof PAGE_SIZES]);
  }

  if (orientation === "landscape") {
    [width, height] = [height, width];
  }

  const handleMeasure = useCallback(
    (measurements: Measurements) => {
      if (!parsedDocument) return;
      const newPages = paginateDocument(parsedDocument, height, measurements);
      setPages(newPages);
    },
    [parsedDocument, height]
  );

  const handleDownloadPdf = useCallback(
    async (customFileName?: string) => {
      if (!isValid || !jsonString || isSaving) return;

      try {
        setIsSaving(true);
        const res = await fetch("/api/pdf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: jsonString,
        });

        if (!res.ok) {
          throw new Error("Failed to generate PDF");
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const baseName =
          customFileName || parsedDocument?.meta?.title || "document";
        a.download = baseName.toLowerCase().endsWith(".pdf")
          ? baseName
          : `${baseName}.pdf`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 1000);
      } catch (error) {
        console.error("Download error:", error);
        alert("Error generating PDF");
      } finally {
        setIsSaving(false);
      }
    },
    [isValid, jsonString, isSaving, parsedDocument]
  );

  // Global listener for PDF download
  const handleDownloadRef = useRef(handleDownloadPdf);
  useEffect(() => {
    handleDownloadRef.current = handleDownloadPdf;
  }, [handleDownloadPdf]);

  useEffect(() => {
    const handleGlobalDownload = () => {
      handleDownloadRef.current();
    };
    window.addEventListener("papercast-download-pdf", handleGlobalDownload);
    return () => {
      window.removeEventListener(
        "papercast-download-pdf",
        handleGlobalDownload
      );
    };
  }, []);

  return {
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
  };
}
