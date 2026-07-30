import React, { useState, useEffect } from "react";
import { useDocumentStore } from "../../store/documentStore";
import { DocumentSection } from "@formcast/core";
import { Trash2 } from "lucide-react";

interface SectionToolbarProps {
  type: "header" | "footer";
  id: string;
  section: DocumentSection;
}

export const SectionToolbar: React.FC<SectionToolbarProps> = ({
  type,
  id,
  section,
}) => {
  const {
    updateHeaderProperty,
    updateFooterProperty,
    deleteHeader,
    deleteFooter,
    parsedDocument,
    updatePageOverrides,
  } = useDocumentStore();

  const [pageInput, setPageInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!parsedDocument) return;
    const overrides = parsedDocument.document.pageOverrides || {};
    const pagesWithThisSection = Object.keys(overrides).filter((page) => {
      if (type === "header") return overrides[page].headerId === id;
      return overrides[page].footerId === id;
    });
    setPageInput(pagesWithThisSection.join(", "));
  }, [parsedDocument, id, type]);

  const handlePropertyChange = (
    key: keyof DocumentSection,
    value: string | number | undefined
  ) => {
    if (type === "header") {
      updateHeaderProperty(id, key, value as any);
    } else {
      updateFooterProperty(id, key, value as any);
    }
  };

  let conditionError: string | null = null;
  const currentCondition = section.condition || "all";
  if (parsedDocument && currentCondition !== "other") {
    const sections =
      type === "header"
        ? parsedDocument.document.headers
        : parsedDocument.document.footers;
    const conflictingId = Object.keys(sections || {}).find(
      (sid) =>
        sid !== id && (sections[sid].condition || "all") === currentCondition
    );
    if (conflictingId) {
      conditionError = `⚠️ The '${currentCondition}' condition is already used by '${sections[conflictingId].name || conflictingId}'. Only one ${type} should use this condition.`;
    }
  }

  const handlePageOverridesSubmit = (
    e:
      React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.type === "keydown" && (e as React.KeyboardEvent).key !== "Enter") {
      return;
    }

    setError(null);
    if (!parsedDocument) return;

    const newPages = pageInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    // Validation: Check if any of these pages already have an override for this type by a DIFFERENT id
    const currentOverrides = {
      ...(parsedDocument.document.pageOverrides || {}),
    };

    for (const page of newPages) {
      if (isNaN(Number(page))) {
        setError(`Invalid page number: ${page}`);
        return;
      }
      const existing = currentOverrides[page];
      if (existing) {
        if (
          type === "header" &&
          existing.headerId &&
          existing.headerId !== id
        ) {
          setError(`Page ${page} already has header '${existing.headerId}'`);
          return;
        }
        if (
          type === "footer" &&
          existing.footerId &&
          existing.footerId !== id
        ) {
          setError(`Page ${page} already has footer '${existing.footerId}'`);
          return;
        }
      }
    }

    // Passed validation, apply changes
    // First, remove this id from all overrides where it currently exists
    Object.keys(currentOverrides).forEach((page) => {
      if (type === "header" && currentOverrides[page].headerId === id) {
        currentOverrides[page] = { ...currentOverrides[page], headerId: null };
      }
      if (type === "footer" && currentOverrides[page].footerId === id) {
        currentOverrides[page] = { ...currentOverrides[page], footerId: null };
      }
      if (
        !currentOverrides[page].headerId &&
        !currentOverrides[page].footerId
      ) {
        delete currentOverrides[page];
      }
    });

    // Add this id to the new pages
    newPages.forEach((page) => {
      if (!currentOverrides[page]) {
        currentOverrides[page] = { headerId: null, footerId: null };
      }
      if (type === "header") {
        currentOverrides[page].headerId = id;
      } else {
        currentOverrides[page].footerId = id;
      }
    });

    updatePageOverrides(currentOverrides);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === "header") deleteHeader(id);
      else deleteFooter(id);
    }
  };

  return (
    <div className="flex items-center space-x-4 bg-gray-100 p-2 border-b border-gray-200 w-full shrink-0">
      <div className="flex flex-col space-y-1">
        <label className="text-[10px] font-medium text-gray-500 uppercase">
          Name
        </label>
        <input
          type="text"
          value={section.name || ""}
          onChange={(e) => handlePropertyChange("name", e.target.value)}
          className="text-xs border border-gray-300 rounded px-1.5 py-1 w-24 outline-none focus:border-blue-500"
          placeholder={`${type} name`}
        />
      </div>

      <div className="flex flex-col space-y-1 relative">
        <label className="text-[10px] font-medium text-gray-500 uppercase">
          Condition
        </label>
        <select
          value={section.condition || "all"}
          onChange={(e) => handlePropertyChange("condition", e.target.value)}
          className={`text-xs border rounded px-1.5 py-1 w-20 outline-none ${
            conditionError
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-blue-500"
          }`}
        >
          <option value="all">All</option>
          <option value="first">First</option>
          <option value="last">Last</option>
          <option value="even">Even</option>
          <option value="odd">Odd</option>
          <option value="other">Other</option>
        </select>
        {conditionError && (
          <div className="absolute top-full left-0 mt-1 bg-yellow-100 text-yellow-800 text-[10px] px-2 py-1 rounded shadow-sm whitespace-nowrap z-20">
            {conditionError}
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-[10px] font-medium text-gray-500 uppercase">
          Height (px)
        </label>
        <input
          type="number"
          value={section.heightPx === undefined ? "" : section.heightPx}
          onChange={(e) =>
            handlePropertyChange(
              "heightPx",
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
          className="text-xs border border-gray-300 rounded px-1.5 py-1 w-16 outline-none focus:border-blue-500"
          placeholder="auto"
        />
      </div>

      <div className="flex flex-col space-y-1 relative">
        <label className="text-[10px] font-medium text-gray-500 uppercase">
          Page Overrides (e.g. 1, 3)
        </label>
        <input
          type="text"
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          onBlur={handlePageOverridesSubmit}
          onKeyDown={handlePageOverridesSubmit}
          className={`text-xs border rounded px-1.5 py-1 w-40 outline-none ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-blue-500"
          }`}
          placeholder="1, 2, 3"
        />
        {error && (
          <div className="absolute top-full left-0 mt-1 bg-red-100 text-red-600 text-[10px] px-2 py-1 rounded shadow-sm whitespace-nowrap z-10">
            {error}
          </div>
        )}
      </div>

      <div className="flex-1" />

      <button
        onClick={handleDelete}
        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
        title={`Delete ${type}`}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};
