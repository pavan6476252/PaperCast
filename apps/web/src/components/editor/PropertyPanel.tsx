import React, { useMemo, useState, useEffect } from "react";
import { useDocumentStore } from "../../store/documentStore";
import { BaseNode, TableColumnConfig, DataBinding } from "../../types/schema";
import { XCircle, GripVertical, Focus } from "lucide-react";
import { getNodeContextPaths } from "../../utils/dataBinding";
import { convertHtmlToNodes } from "../../utils/htmlParser";

export const PropertyPanel: React.FC = () => {
  const {
    selectedNodeId,
    parsedDocument,
    updateNodeProperty,
    setSelectedNodeId,
    isValid,
    replaceNode,
  } = useDocumentStore();
  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"styling" | "data">("styling");
  const [draggedColumnIdx, setDraggedColumnIdx] = useState<number | null>(null);

  useEffect(() => {
    setSelectedColumnIndex(null);
    setActiveTab("styling");
    setDraggedColumnIdx(null);
  }, [selectedNodeId]);

  const selectedNode = useMemo(() => {
    if (!selectedNodeId || !parsedDocument) return null;

    const baseNodeId = selectedNodeId.split("-part")[0];

    // A simple recursive search:
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
    if (parsedDocument.document.body) {
      found = findNode(parsedDocument.document.body);
    }

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
    if (!found && parsedDocument.definitions?.widgets) {
      for (const w of Object.values(parsedDocument.definitions.widgets)) {
        if (w.root && !found) found = findNode(w.root);
      }
    }

    return found;
  }, [selectedNodeId, parsedDocument]);

  const dataPaths = useMemo(() => {
    if (!parsedDocument || !selectedNodeId) return [];
    return getNodeContextPaths(parsedDocument, selectedNodeId);
  }, [parsedDocument, selectedNodeId]);

  if (!selectedNodeId) {
    return (
      <div className="p-4 text-gray-500 text-sm">
        No element selected. Click on an element in the preview to edit its
        properties.
      </div>
    );
  }

  if (!selectedNode) {
    return (
      <div className="p-4 text-red-500 text-sm">
        Selected element (ID: {selectedNodeId}) not found in the document tree.
      </div>
    );
  }

  const handleUpdate = (
    group: "layout" | "style" | "props" | "bind",
    key: string,
    value: any
  ) => {
    updateNodeProperty(selectedNodeId, group, key, value);
  };

  const layout = selectedNode.layout || {};
  const style = selectedNode.style || {};
  const props = (selectedNode as any).props || {};
  const bind: Partial<DataBinding> = selectedNode.bind || {};

  if (!isValid) {
    return (
      <div className="flex flex-col h-full bg-white overflow-y-auto text-sm text-gray-800">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-red-50 sticky top-0 z-10">
          <h3 className="font-semibold text-red-900">Properties (Locked)</h3>
        </div>
        <div className="p-6 text-center text-red-600">
          <p>
            Please fix JSON syntax errors in the editor to use the visual
            property panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto text-sm text-gray-800">
      <div className="p-3 border-b border-gray-200 bg-gray-50 sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
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
                  const containerRect = scrollContainer.getBoundingClientRect();
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
          <p className="text-xs text-gray-500">
            ID:{" "}
            <span className="font-mono text-gray-800">{selectedNode.id}</span>
          </p>
        </div>
        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
          {selectedNode.type}
        </span>
      </div>

      <div className="flex border-b border-gray-200 sticky top-[45px] z-10 bg-white">
        <button
          className={`flex-1 py-2 text-xs font-medium text-center ${activeTab === "styling" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" : "text-gray-500 hover:bg-gray-50"}`}
          onClick={() => setActiveTab("styling")}
        >
          Styling
        </button>
        <button
          className={`flex-1 py-2 text-xs font-medium text-center ${activeTab === "data" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" : "text-gray-500 hover:bg-gray-50"}`}
          onClick={() => setActiveTab("data")}
        >
          Data Binding
        </button>
      </div>

      <div className="p-4 space-y-6">
        {activeTab === "data" && (
          <>
            <PropertyGroup title="Data Binding">
              <StringProp
                label="path"
                value={bind.path}
                suggestions={dataPaths}
                onChange={(v) => handleUpdate("bind", "path", v)}
              />
              <SelectProp
                label="mode"
                value={bind.mode}
                options={["single", "repeat"]}
                onChange={(v) => handleUpdate("bind", "mode", v)}
              />
              {bind.mode === "repeat" && (
                <StringProp
                  label="itemAlias"
                  value={bind.itemAlias}
                  onChange={(v) => handleUpdate("bind", "itemAlias", v)}
                />
              )}
            </PropertyGroup>

            {selectedNode.type === "table" && (
              <PropertyGroup title="Table Columns">
                <div className="space-y-2">
                  {(props.columns || []).map(
                    (col: TableColumnConfig, idx: number) => (
                      <div
                        key={idx}
                        className={`border rounded overflow-hidden ${draggedColumnIdx === idx ? "opacity-50 border-blue-400" : "border-gray-200"}`}
                        draggable
                        onDragStart={(e) => {
                          setDraggedColumnIdx(idx);
                          e.dataTransfer.effectAllowed = "move";
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = "move";
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (
                            draggedColumnIdx === null ||
                            draggedColumnIdx === idx
                          )
                            return;
                          const newCols = [...(props.columns || [])];
                          const draggedCol = newCols[draggedColumnIdx];
                          newCols.splice(draggedColumnIdx, 1);
                          newCols.splice(idx, 0, draggedCol);
                          handleUpdate("props", "columns", newCols);
                          setDraggedColumnIdx(null);

                          if (selectedColumnIndex === draggedColumnIdx)
                            setSelectedColumnIndex(idx);
                          else if (selectedColumnIndex === idx)
                            setSelectedColumnIndex(draggedColumnIdx);
                        }}
                        onDragEnd={() => setDraggedColumnIdx(null)}
                      >
                        <div
                          className={`flex justify-between items-center p-2 cursor-pointer ${selectedColumnIndex === idx ? "bg-blue-50" : "bg-gray-50"}`}
                          onClick={() =>
                            setSelectedColumnIndex(
                              selectedColumnIndex === idx ? null : idx
                            )
                          }
                        >
                          <div className="flex items-center gap-2">
                            <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                              <GripVertical size={14} />
                            </div>
                            <div className="text-xs font-medium truncate max-w-[120px]">
                              {col.headerText ||
                                col.bindPath ||
                                `Column ${idx + 1}`}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const newCols = [...(props.columns || [])];
                                newCols[idx] = {
                                  ...newCols[idx],
                                  hidden: !newCols[idx].hidden,
                                };
                                handleUpdate("props", "columns", newCols);
                              }}
                              className="text-xs text-gray-500 hover:text-gray-800"
                              title="Toggle Visibility"
                            >
                              {col.hidden ? "Show" : "Hide"}
                            </button>
                          </div>
                        </div>
                        {selectedColumnIndex === idx && (
                          <div className="p-3 bg-white border-t border-gray-100 space-y-2">
                            <StringProp
                              label="headerText"
                              value={col.headerText}
                              onChange={(v) => {
                                const newCols = [...(props.columns || [])];
                                newCols[idx] = {
                                  ...newCols[idx],
                                  headerText: v,
                                };
                                handleUpdate("props", "columns", newCols);
                              }}
                            />
                            <StringProp
                              label="bindPath"
                              value={col.bindPath}
                              suggestions={dataPaths}
                              onChange={(v) => {
                                const newCols = [...(props.columns || [])];
                                newCols[idx] = { ...newCols[idx], bindPath: v };
                                handleUpdate("props", "columns", newCols);
                              }}
                            />
                            <NumberProp
                              label="widthPx"
                              value={col.widthPx}
                              onChange={(v) => {
                                const newCols = [...(props.columns || [])];
                                newCols[idx] = { ...newCols[idx], widthPx: v };
                                handleUpdate("props", "columns", newCols);
                              }}
                            />
                            <NumberProp
                              label="flex"
                              value={col.flex}
                              onChange={(v) => {
                                const newCols = [...(props.columns || [])];
                                newCols[idx] = { ...newCols[idx], flex: v };
                                handleUpdate("props", "columns", newCols);
                              }}
                            />
                            <SelectProp
                              label="align"
                              value={col.align}
                              options={["left", "center", "right"]}
                              onChange={(v) => {
                                const newCols = [...(props.columns || [])];
                                newCols[idx] = { ...newCols[idx], align: v };
                                handleUpdate("props", "columns", newCols);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )
                  )}
                  <button
                    onClick={() => {
                      const newCols = [
                        ...(props.columns || []),
                        { headerText: "New Column", align: "left" },
                      ];
                      handleUpdate("props", "columns", newCols);
                      setSelectedColumnIndex(newCols.length - 1);
                    }}
                    className="w-full py-1.5 border border-dashed border-gray-300 text-gray-500 rounded text-xs hover:bg-gray-50 hover:text-gray-800"
                  >
                    + Add Column
                  </button>
                </div>
              </PropertyGroup>
            )}
          </>
        )}

        {activeTab === "styling" && (
          <>
            {/* Node Properties (Type Specific) */}
            {selectedNode.type === "text" && (
              <PropertyGroup title="Text Properties">
                <StringProp
                  label="literal"
                  value={selectedNode.props?.literal}
                  suggestions={dataPaths}
                  onChange={(v) => handleUpdate("props", "literal", v)}
                />
                <CheckboxProp
                  label="isAnchor"
                  value={selectedNode.props?.isAnchor}
                  onChange={(v) => handleUpdate("props", "isAnchor", v)}
                />
                {selectedNode.props?.isAnchor && (
                  <>
                    <StringProp
                      label="hrefLiteral"
                      value={selectedNode.props?.hrefLiteral}
                      onChange={(v) => handleUpdate("props", "hrefLiteral", v)}
                    />
                    <StringProp
                      label="hrefBind"
                      value={selectedNode.props?.hrefBind}
                      suggestions={dataPaths}
                      onChange={(v) => handleUpdate("props", "hrefBind", v)}
                    />
                  </>
                )}
              </PropertyGroup>
            )}

            {selectedNode.type === "image" && (
              <PropertyGroup title="Image Properties">
                <StringProp
                  label="srcLiteral"
                  value={selectedNode.props?.srcLiteral}
                  onChange={(v) => handleUpdate("props", "srcLiteral", v)}
                />
                <StringProp
                  label="srcBind"
                  value={selectedNode.props?.srcBind}
                  suggestions={dataPaths}
                  onChange={(v) => handleUpdate("props", "srcBind", v)}
                />
                <SelectProp
                  label="fit"
                  value={selectedNode.props?.fit}
                  options={["contain", "cover", "stretch"]}
                  onChange={(v) => handleUpdate("props", "fit", v)}
                />
              </PropertyGroup>
            )}

            {selectedNode.type === "spacer" && (
              <PropertyGroup title="Spacer Properties">
                <NumberProp
                  label="sizePx"
                  value={selectedNode.props?.sizePx}
                  onChange={(v) => handleUpdate("props", "sizePx", v)}
                />
              </PropertyGroup>
            )}

            {selectedNode.type === "widgetInstance" && (
              <PropertyGroup title="Widget Properties">
                <StringProp
                  label="definitionId"
                  value={selectedNode.props?.definitionId}
                  onChange={(v) => handleUpdate("props", "definitionId", v)}
                />
              </PropertyGroup>
            )}

            {selectedNode.type === "listTile" && (
              <PropertyGroup title="List Tile Properties">
                <StringProp
                  label="titleLiteral"
                  value={selectedNode.props?.titleLiteral}
                  onChange={(v) => handleUpdate("props", "titleLiteral", v)}
                />
                <StringProp
                  label="titleBind"
                  value={selectedNode.props?.titleBind}
                  suggestions={dataPaths}
                  onChange={(v) => handleUpdate("props", "titleBind", v)}
                />
                <StringProp
                  label="subLiteral"
                  value={selectedNode.props?.subtitleLiteral}
                  onChange={(v) => handleUpdate("props", "subtitleLiteral", v)}
                />
                <StringProp
                  label="subBind"
                  value={selectedNode.props?.subtitleBind}
                  suggestions={dataPaths}
                  onChange={(v) => handleUpdate("props", "subtitleBind", v)}
                />
              </PropertyGroup>
            )}

            {selectedNode.type === "richText" && (
              <PropertyGroup title="Rich Text Editor">
                <StringProp
                  label="htmlBind"
                  value={selectedNode.props?.htmlBind}
                  suggestions={dataPaths}
                  onChange={(v) => handleUpdate("props", "htmlBind", v)}
                />
                <div className="flex flex-col text-sm group mt-3">
                  <label className="text-gray-600 mb-1 text-xs font-medium">
                    htmlLiteral (Markup)
                  </label>
                  <textarea
                    value={selectedNode.props?.htmlLiteral || ""}
                    onChange={(e) =>
                      handleUpdate("props", "htmlLiteral", e.target.value)
                    }
                    className="w-full min-w-0 border border-gray-300 rounded px-2 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs bg-white text-black h-32"
                    placeholder="<b>Bold</b> and <i>Italic</i>"
                  />
                </div>

                <div className="border-t border-gray-150 my-4 pt-3.5">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Page Setup & Layout
                  </div>
                  <p className="text-[11px] text-gray-500 mb-3 leading-relaxed">
                    A single Rich Text block cannot split across page
                    boundaries. Convert its HTML paragraphs, headers, and lists
                    into separate FormCast widgets inside a layout container to
                    enable page splitting.
                  </p>
                  <button
                    onClick={() => {
                      const html = selectedNode.props?.htmlLiteral || "";
                      const childNodes = convertHtmlToNodes(html);
                      if (childNodes.length > 0) {
                        const newContainerNode: BaseNode = {
                          id: `node-${Date.now()}`,
                          type: "column",
                          layout: {
                            minHeight: 40,
                            rowGap: 8,
                          },
                          children: childNodes,
                        };
                        replaceNode(selectedNode.id, newContainerNode);
                        setSelectedNodeId(newContainerNode.id);
                      }
                    }}
                    className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-colors border border-blue-200/50 cursor-pointer"
                  >
                    Deconstruct HTML into Widgets
                  </button>
                </div>
              </PropertyGroup>
            )}

            {selectedNode.type === "checkbox" && (
              <PropertyGroup title="Checkbox Properties">
                <StringProp
                  label="labelLiteral"
                  value={selectedNode.props?.labelLiteral}
                  onChange={(v) => handleUpdate("props", "labelLiteral", v)}
                />
                <StringProp
                  label="labelBind"
                  value={selectedNode.props?.labelBind}
                  suggestions={dataPaths}
                  onChange={(v) => handleUpdate("props", "labelBind", v)}
                />
                <CheckboxProp
                  label="checkedLiteral"
                  value={selectedNode.props?.checkedLiteral}
                  onChange={(v) => handleUpdate("props", "checkedLiteral", v)}
                />
                <StringProp
                  label="checkedBind"
                  value={selectedNode.props?.checkedBind}
                  suggestions={dataPaths}
                  onChange={(v) => handleUpdate("props", "checkedBind", v)}
                />
              </PropertyGroup>
            )}

            {selectedNode.type === "radio" && (
              <PropertyGroup title="Radio Properties">
                <StringProp
                  label="name"
                  value={selectedNode.props?.name}
                  onChange={(v) => handleUpdate("props", "name", v)}
                />
                <StringProp
                  label="value"
                  value={selectedNode.props?.value}
                  onChange={(v) => handleUpdate("props", "value", v)}
                />
                <StringProp
                  label="labelLiteral"
                  value={selectedNode.props?.labelLiteral}
                  onChange={(v) => handleUpdate("props", "labelLiteral", v)}
                />
                <StringProp
                  label="labelBind"
                  value={selectedNode.props?.labelBind}
                  suggestions={dataPaths}
                  onChange={(v) => handleUpdate("props", "labelBind", v)}
                />
                <CheckboxProp
                  label="checkedLiteral"
                  value={selectedNode.props?.checkedLiteral}
                  onChange={(v) => handleUpdate("props", "checkedLiteral", v)}
                />
                <StringProp
                  label="checkedBind"
                  value={selectedNode.props?.checkedBind}
                  suggestions={dataPaths}
                  onChange={(v) => handleUpdate("props", "checkedBind", v)}
                />
              </PropertyGroup>
            )}

            {selectedNode.type === "radioGroup" && (
              <PropertyGroup title="Radio Group Properties">
                <StringProp
                  label="name"
                  value={selectedNode.props?.name}
                  onChange={(v) => handleUpdate("props", "name", v)}
                />
                <StringProp
                  label="valueLiteral"
                  value={selectedNode.props?.valueLiteral}
                  onChange={(v) => handleUpdate("props", "valueLiteral", v)}
                />
                <StringProp
                  label="valueBind"
                  value={selectedNode.props?.valueBind}
                  suggestions={dataPaths}
                  onChange={(v) => handleUpdate("props", "valueBind", v)}
                />
              </PropertyGroup>
            )}

            <PropertyGroup title="Layout: Sizing & Spacing">
              <SizeProp
                label="width"
                value={layout.width}
                onChange={(v) => handleUpdate("layout", "width", v)}
              />
              <SizeProp
                label="height"
                value={layout.height}
                onChange={(v) => handleUpdate("layout", "height", v)}
              />
              <NumberProp
                label="minHeight"
                value={layout.minHeight}
                onChange={(v) => handleUpdate("layout", "minHeight", v)}
              />

              <div className="text-xs font-medium text-gray-500 mb-1 mt-4">
                Margins
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <NumberProp
                  label="Top"
                  labelWidth="w-12"
                  value={layout.marginTop}
                  onChange={(v) => handleUpdate("layout", "marginTop", v)}
                />
                <NumberProp
                  label="Bottom"
                  labelWidth="w-12"
                  value={layout.marginBottom}
                  onChange={(v) => handleUpdate("layout", "marginBottom", v)}
                />
                <NumberProp
                  label="Left"
                  labelWidth="w-12"
                  value={layout.marginLeft}
                  onChange={(v) => handleUpdate("layout", "marginLeft", v)}
                />
                <NumberProp
                  label="Right"
                  labelWidth="w-12"
                  value={layout.marginRight}
                  onChange={(v) => handleUpdate("layout", "marginRight", v)}
                />
              </div>

              <div className="text-xs font-medium text-gray-500 mb-1">
                Padding
              </div>
              <div className="grid grid-cols-2 gap-2">
                <NumberProp
                  label="Top"
                  labelWidth="w-12"
                  value={layout.paddingTop}
                  onChange={(v) => handleUpdate("layout", "paddingTop", v)}
                />
                <NumberProp
                  label="Bottom"
                  labelWidth="w-12"
                  value={layout.paddingBottom}
                  onChange={(v) => handleUpdate("layout", "paddingBottom", v)}
                />
                <NumberProp
                  label="Left"
                  labelWidth="w-12"
                  value={layout.paddingLeft}
                  onChange={(v) => handleUpdate("layout", "paddingLeft", v)}
                />
                <NumberProp
                  label="Right"
                  labelWidth="w-12"
                  value={layout.paddingRight}
                  onChange={(v) => handleUpdate("layout", "paddingRight", v)}
                />
              </div>
            </PropertyGroup>

            <PropertyGroup title="Layout: Flexbox">
              <SelectProp
                label="direction"
                value={layout.direction}
                options={["row", "column"]}
                onChange={(v) => handleUpdate("layout", "direction", v)}
              />
              <SelectProp
                label="justifyContent"
                value={layout.justifyContent}
                options={[
                  "flex-start",
                  "center",
                  "flex-end",
                  "space-between",
                  "space-around",
                ]}
                onChange={(v) => handleUpdate("layout", "justifyContent", v)}
              />
              <SelectProp
                label="alignItems"
                value={layout.alignItems}
                options={["flex-start", "center", "flex-end", "stretch"]}
                onChange={(v) => handleUpdate("layout", "alignItems", v)}
              />
              <SelectProp
                label="wrap"
                value={layout.wrap?.toString()}
                options={["true", "false"]}
                onChange={(v) =>
                  handleUpdate(
                    "layout",
                    "wrap",
                    v === "true" ? true : v === "false" ? false : undefined
                  )
                }
              />

              <div className="grid grid-cols-2 gap-2 mt-2">
                <NumberProp
                  label="rowGap"
                  labelWidth="w-16"
                  value={layout.rowGap}
                  onChange={(v) => handleUpdate("layout", "rowGap", v)}
                />
                <NumberProp
                  label="columnGap"
                  labelWidth="w-16"
                  value={layout.columnGap}
                  onChange={(v) => handleUpdate("layout", "columnGap", v)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <SizeProp
                  label="flex"
                  labelWidth="w-16"
                  value={layout.flex}
                  onChange={(v) => handleUpdate("layout", "flex", v)}
                />
                <NumberProp
                  label="flexGrow"
                  labelWidth="w-16"
                  value={layout.flexGrow}
                  onChange={(v) => handleUpdate("layout", "flexGrow", v)}
                />
                <NumberProp
                  label="flexShrink"
                  labelWidth="w-16"
                  value={layout.flexShrink}
                  onChange={(v) => handleUpdate("layout", "flexShrink", v)}
                />
                <SizeProp
                  label="flexBasis"
                  labelWidth="w-16"
                  value={layout.flexBasis}
                  onChange={(v) => handleUpdate("layout", "flexBasis", v)}
                />
              </div>
            </PropertyGroup>

            <PropertyGroup title="Typography & Color">
              <ColorProp
                label="color"
                value={style.color}
                onChange={(v) => handleUpdate("style", "color", v)}
              />
              <ColorProp
                label="backgroundColor"
                value={style.backgroundColor}
                onChange={(v) => handleUpdate("style", "backgroundColor", v)}
              />

              <div className="grid grid-cols-2 gap-2 mt-2">
                <NumberProp
                  label="size px"
                  labelWidth="w-12"
                  value={style.fontSizePx}
                  onChange={(v) => handleUpdate("style", "fontSizePx", v)}
                />
                <NumberProp
                  label="line Ht"
                  labelWidth="w-12"
                  value={style.lineHeight}
                  onChange={(v) => handleUpdate("style", "lineHeight", v)}
                />
              </div>

              <SelectProp
                label="textAlign"
                value={style.textAlign}
                options={["left", "center", "right", "justify"]}
                onChange={(v) => handleUpdate("style", "textAlign", v)}
              />
              <SelectProp
                label="fontWeight"
                value={style.fontWeight?.toString()}
                options={["normal", "bold"]}
                onChange={(v) =>
                  handleUpdate(
                    "style",
                    "fontWeight",
                    v === "normal" || v === "bold" ? v : Number(v) || undefined
                  )
                }
              />
              <SelectProp
                label="fontStyle"
                value={style.fontStyle}
                options={["normal", "italic"]}
                onChange={(v) => handleUpdate("style", "fontStyle", v)}
              />
              <SelectProp
                label="textDecoration"
                value={style.textDecoration}
                options={["none", "underline"]}
                onChange={(v) => handleUpdate("style", "textDecoration", v)}
              />
              <StringProp
                label="fontFamily"
                value={style.fontFamily}
                onChange={(v) => handleUpdate("style", "fontFamily", v)}
              />
            </PropertyGroup>

            <PropertyGroup title="Borders">
              <div className="space-y-4">
                {["Top", "Right", "Bottom", "Left"].map((side) => (
                  <div
                    key={side}
                    className="p-2 border border-gray-100 rounded bg-gray-50"
                  >
                    <div className="text-xs font-medium text-gray-500 mb-2">
                      {side}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <NumberProp
                        label="width"
                        labelWidth="w-10"
                        value={(layout as any)[`border${side}Width`]}
                        onChange={(v) =>
                          handleUpdate("layout", `border${side}Width`, v)
                        }
                      />
                      <SelectProp
                        label="style"
                        labelWidth="w-10"
                        value={(layout as any)[`border${side}Style`]}
                        options={["solid", "dashed", "none"]}
                        onChange={(v) =>
                          handleUpdate("layout", `border${side}Style`, v)
                        }
                      />
                    </div>
                    <div className="mt-2">
                      <ColorProp
                        label="color"
                        value={(layout as any)[`border${side}Color`]}
                        onChange={(v) =>
                          handleUpdate("layout", `border${side}Color`, v)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </PropertyGroup>

            <PropertyGroup title="Pagination">
              <SelectProp
                label="breakInside"
                value={layout.breakInside}
                options={["auto", "avoid"]}
                onChange={(v) => handleUpdate("layout", "breakInside", v)}
              />
              <SelectProp
                label="keepWithNext"
                value={layout.keepWithNext?.toString()}
                options={["true", "false"]}
                onChange={(v) =>
                  handleUpdate(
                    "layout",
                    "keepWithNext",
                    v === "true" ? true : v === "false" ? false : undefined
                  )
                }
              />
            </PropertyGroup>
          </>
        )}
      </div>
    </div>
  );
};

// -- Helper Components --

const PropertyGroup: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="mb-6">
    <h4 className="font-semibold text-gray-700 border-b border-gray-200 pb-1 mb-3">
      {title}
    </h4>
    <div className="space-y-2">{children}</div>
  </div>
);

// Generic hook for debounced input state
function useDebouncedInput<T>(
  propValue: T,
  onChange: (val: T | undefined) => void,
  delay = 150
) {
  const [localValue, setLocalValue] = useState<T | undefined>(propValue);

  // Sync from props
  useEffect(() => {
    setLocalValue(propValue);
  }, [propValue]);

  // Sync to parent (debounced)
  useEffect(() => {
    if (localValue === propValue) return;
    const handler = setTimeout(() => {
      onChange(localValue);
    }, delay);
    return () => clearTimeout(handler);
  }, [localValue, delay, onChange, propValue]);

  const handleClear = () => {
    setLocalValue(undefined);
    onChange(undefined);
  };

  return { localValue, setLocalValue, handleClear };
}

const CheckboxProp: React.FC<{
  label: string;
  value: any;
  onChange: (val: boolean | undefined) => void;
  labelWidth?: string;
}> = ({ label, value, onChange, labelWidth = "w-24" }) => {
  const isInherited = value === undefined || value === null;

  return (
    <div className="flex items-center text-sm group h-8">
      <label
        className={`${labelWidth} text-gray-600 truncate mr-2 text-xs shrink-0 cursor-pointer`}
        title={label}
        onClick={() => onChange(!value)}
      >
        {label}
      </label>
      <div className="flex-1 relative flex items-center min-w-0">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="cursor-pointer"
        />
        {!isInherited && (
          <button
            onClick={() => onChange(undefined)}
            className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 p-1 bg-white flex items-center justify-center"
          >
            <XCircle size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

const SizeProp: React.FC<{
  label: string;
  value: any;
  onChange: (val: number | string | undefined) => void;
  labelWidth?: string;
}> = ({ label, value, onChange, labelWidth = "w-24" }) => {
  const { localValue, setLocalValue, handleClear } = useDebouncedInput<
    number | string | undefined
  >(value, onChange);
  const isInherited = localValue === undefined || localValue === null;

  return (
    <div className="flex items-center text-sm group">
      <label
        className={`${labelWidth} text-gray-600 truncate mr-2 text-xs shrink-0`}
        title={label}
      >
        {label}
      </label>
      <div className="flex-1 relative flex items-center min-w-0">
        <input
          type="text"
          value={isInherited ? "" : localValue}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") setLocalValue(undefined);
            else if (!isNaN(Number(val))) setLocalValue(Number(val));
            else setLocalValue(val);
          }}
          className={`w-full min-w-0 border rounded px-2 py-1 pr-6 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-white ${isInherited ? "border-dashed border-gray-300 text-gray-400 italic" : "border-gray-300"}`}
          placeholder="inherited"
        />
        {!isInherited && (
          <button
            onClick={handleClear}
            className="absolute right-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 p-1 bg-white"
          >
            <XCircle size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

const NumberProp: React.FC<{
  label: string;
  value: any;
  onChange: (val: number | undefined) => void;
  labelWidth?: string;
}> = ({ label, value, onChange, labelWidth = "w-24" }) => {
  const { localValue, setLocalValue, handleClear } = useDebouncedInput<
    number | undefined
  >(value, onChange);
  const isInherited = localValue === undefined || localValue === null;

  return (
    <div className="flex items-center text-sm group">
      <label
        className={`${labelWidth} text-gray-600 truncate mr-2 text-xs shrink-0`}
        title={label}
      >
        {label}
      </label>
      <div className="flex-1 relative flex items-center min-w-0">
        <input
          type="number"
          value={isInherited ? "" : localValue}
          onChange={(e) =>
            setLocalValue(
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
          className={`w-full min-w-0 border rounded px-2 py-1 pr-6 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isInherited ? "border-dashed border-gray-300 text-gray-400 italic" : "border-gray-300"}`}
          placeholder="inherited"
        />
        {!isInherited && (
          <button
            onClick={handleClear}
            className="absolute right-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 p-1 bg-white"
          >
            <XCircle size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

const StringProp: React.FC<{
  label: string;
  value: any;
  onChange: (val: string | undefined) => void;
  labelWidth?: string;
  suggestions?: string[];
}> = ({ label, value, onChange, labelWidth = "w-24", suggestions }) => {
  const { localValue, setLocalValue, handleClear } = useDebouncedInput<
    string | undefined
  >(value, onChange);
  const isInherited = localValue === undefined || localValue === null;
  const listId = `suggestions-${label.replace(/\s+/g, "-")}`;

  return (
    <div className="flex items-center text-sm group">
      <label
        className={`${labelWidth} text-gray-600 truncate mr-2 text-xs shrink-0`}
        title={label}
      >
        {label}
      </label>
      <div className="flex-1 relative flex items-center min-w-0">
        <input
          type="text"
          list={suggestions?.length ? listId : undefined}
          value={isInherited ? "" : localValue}
          onChange={(e) =>
            setLocalValue(e.target.value === "" ? undefined : e.target.value)
          }
          className={`w-full min-w-0 border rounded px-2 py-1 pr-6 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-white ${isInherited ? "border-dashed border-gray-300 text-gray-400 italic" : "border-gray-300"}`}
          placeholder="inherited"
        />
        {suggestions?.length ? (
          <datalist id={listId}>
            {suggestions.map((s, idx) => (
              <option key={idx} value={s} />
            ))}
          </datalist>
        ) : null}
        {!isInherited && (
          <button
            onClick={handleClear}
            className="absolute right-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 p-1 bg-white"
          >
            <XCircle size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

const SelectProp: React.FC<{
  label: string;
  value: any;
  options: string[];
  onChange: (val: string | undefined) => void;
  labelWidth?: string;
}> = ({ label, value, options, onChange, labelWidth = "w-24" }) => {
  const { localValue, setLocalValue, handleClear } = useDebouncedInput<
    string | undefined
  >(value, onChange);
  const isInherited = localValue === undefined || localValue === null;

  return (
    <div className="flex items-center text-sm group">
      <label
        className={`${labelWidth} text-gray-600 truncate mr-2 text-xs shrink-0`}
        title={label}
      >
        {label}
      </label>
      <div className="flex-1 relative flex items-center min-w-0">
        <select
          value={isInherited ? "" : localValue?.toString()}
          onChange={(e) =>
            setLocalValue(e.target.value === "" ? undefined : e.target.value)
          }
          className={`w-full min-w-0 border rounded px-2 py-1 pr-6 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-white ${isInherited ? "border-dashed border-gray-300 text-gray-500 italic" : "border-gray-300"}`}
        >
          <option value="" disabled hidden>
            inherited
          </option>
          <option value="">(clear)</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        {!isInherited && (
          <button
            onClick={handleClear}
            className="absolute right-5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 p-1 bg-white"
          >
            <XCircle size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

const ColorProp: React.FC<{
  label: string;
  value: any;
  onChange: (val: string | undefined) => void;
  labelWidth?: string;
}> = ({ label, value, onChange, labelWidth = "w-24" }) => {
  const { localValue, setLocalValue, handleClear } = useDebouncedInput<
    string | undefined
  >(value, onChange, 100);
  const isInherited = localValue === undefined || localValue === null;

  return (
    <div className="flex items-center text-sm group">
      <label
        className={`${labelWidth} text-gray-600 truncate mr-2 text-xs shrink-0`}
        title={label}
      >
        {label}
      </label>
      <div className="flex-1 flex items-center gap-2 relative">
        <input
          type="color"
          value={isInherited ? "#000000" : localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className="h-6 w-8 p-0 border-0 cursor-pointer shrink-0"
        />
        <div className="flex-1 relative flex items-center min-w-0">
          <input
            type="text"
            value={isInherited ? "" : localValue}
            onChange={(e) =>
              setLocalValue(e.target.value === "" ? undefined : e.target.value)
            }
            className={`w-full min-w-0 border rounded px-2 py-1 pr-6 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs text-black bg-white ${isInherited ? "border-dashed border-gray-300 text-gray-400 italic" : "border-gray-300"}`}
            placeholder="inherited"
          />
          {!isInherited && (
            <button
              onClick={handleClear}
              className="absolute right-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 p-1 bg-white"
            >
              <XCircle size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
