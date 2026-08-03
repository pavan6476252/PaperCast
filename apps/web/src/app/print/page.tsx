"use client";

import React, { useEffect, useState } from "react";
import { DocumentPreview } from "../../components/renderer/DocumentPreview";
import { useDocumentStore } from "../../store/documentStore";
import { registerDefaultWidgets } from "@formcast/react/widgets";

registerDefaultWidgets();

export default function PrintPage() {
  const setJsonString = useDocumentStore((state) => state.setJsonString);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // The Puppeteer script will inject the data into window.__PRINT_DATA__
    const data = (window as any).__PRINT_DATA__;
    if (data) {
      setJsonString(data);
    }
    setReady(true);
  }, [setJsonString]);

  if (!ready) return null;

  return (
    <div className="print-only-container w-full h-full">
      <DocumentPreview />
    </div>
  );
}
