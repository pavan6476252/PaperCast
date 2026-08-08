import React, { useState, useEffect } from "react";
import { XCircle } from "lucide-react";

export const PropertyGroup: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="mb-6">
    <h4 className="font-semibold text-foreground/80 border-b border-border pb-1 mb-3">
      {title}
    </h4>
    <div className="space-y-2">{children}</div>
  </div>
);

// Generic hook for debounced input state
export function useDebouncedInput<T>(
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

export const CheckboxProp: React.FC<{
  label: string;
  value: any;
  onChange: (val: boolean | undefined) => void;
  labelWidth?: string;
}> = ({ label, value, onChange, labelWidth = "w-24" }) => {
  const isInherited = value === undefined || value === null;

  return (
    <div className="flex items-center text-sm group h-8">
      <label
        className={`${labelWidth} text-foreground/70 truncate mr-2 text-xs shrink-0 cursor-pointer`}
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
            className="ml-2 text-foreground/40 hover:text-red-500 opacity-0 group-hover:opacity-100 p-1 bg-background flex items-center justify-center"
          >
            <XCircle size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export const SizeProp: React.FC<{
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
        className={`${labelWidth} text-foreground/70 truncate mr-2 text-xs shrink-0`}
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
          className={`w-full min-w-0 border rounded px-2 py-1 pr-6 focus:outline-none focus:ring-1 focus:ring-accent text-foreground bg-background ${isInherited ? "border-dashed border-border/80 text-foreground/40 italic" : "border-border/80"}`}
          placeholder="inherited"
        />
        {!isInherited && (
          <button
            onClick={handleClear}
            className="absolute right-1 text-foreground/40 hover:text-red-500 opacity-0 group-hover:opacity-100 p-1 bg-background"
          >
            <XCircle size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export const NumberProp: React.FC<{
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
        className={`${labelWidth} text-foreground/70 truncate mr-2 text-xs shrink-0`}
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
          className={`w-full min-w-0 border rounded px-2 py-1 pr-6 focus:outline-none focus:ring-1 focus:ring-accent text-foreground bg-background [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isInherited ? "border-dashed border-border/80 text-foreground/40 italic" : "border-border/80"}`}
          placeholder="inherited"
        />
        {!isInherited && (
          <button
            onClick={handleClear}
            className="absolute right-1 text-foreground/40 hover:text-red-500 opacity-0 group-hover:opacity-100 p-1 bg-background"
          >
            <XCircle size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export const StringProp: React.FC<{
  label: string;
  value: any;
  onChange: (val: string | undefined) => void;
  labelWidth?: string;
  suggestions?: string[];
  disabled?: boolean;
}> = ({
  label,
  value,
  onChange,
  labelWidth = "w-24",
  suggestions,
  disabled,
}) => {
  const { localValue, setLocalValue, handleClear } = useDebouncedInput<
    string | undefined
  >(value, onChange);
  const isInherited = localValue === undefined || localValue === null;
  const listId = `suggestions-${label.replace(/\s+/g, "-")}`;

  return (
    <div className="flex items-center text-sm group">
      <label
        className={`${labelWidth} text-foreground/70 truncate mr-2 text-xs shrink-0`}
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
          disabled={disabled}
          className={`w-full min-w-0 border rounded px-2 py-1 pr-6 focus:outline-none focus:ring-1 focus:ring-accent text-foreground bg-background disabled:opacity-50 disabled:cursor-not-allowed ${isInherited ? "border-dashed border-border/80 text-foreground/40 italic" : "border-border/80"}`}
          placeholder="inherited"
        />
        {suggestions?.length ? (
          <datalist id={listId}>
            {suggestions.map((s, idx) => (
              <option key={idx} value={s} />
            ))}
          </datalist>
        ) : null}
        {!isInherited && !disabled && (
          <button
            onClick={handleClear}
            className="absolute right-1 text-foreground/40 hover:text-red-500 opacity-0 group-hover:opacity-100 p-1 bg-background"
          >
            <XCircle size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export const SelectProp: React.FC<{
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
        className={`${labelWidth} text-foreground/70 truncate mr-2 text-xs shrink-0`}
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
          className={`w-full min-w-0 border rounded px-2 py-1 pr-6 focus:outline-none focus:ring-1 focus:ring-accent text-foreground bg-background ${isInherited ? "border-dashed border-border/80 text-foreground/50 italic" : "border-border/80"}`}
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
            className="absolute right-5 text-foreground/40 hover:text-red-500 opacity-0 group-hover:opacity-100 p-1 bg-background"
          >
            <XCircle size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export const ColorProp: React.FC<{
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
        className={`${labelWidth} text-foreground/70 truncate mr-2 text-xs shrink-0`}
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
            className={`w-full min-w-0 border rounded px-2 py-1 pr-6 focus:outline-none focus:ring-1 focus:ring-accent font-mono text-xs text-foreground bg-background ${isInherited ? "border-dashed border-border/80 text-foreground/40 italic" : "border-border/80"}`}
            placeholder="inherited"
          />
          {!isInherited && (
            <button
              onClick={handleClear}
              className="absolute right-1 text-foreground/40 hover:text-red-500 opacity-0 group-hover:opacity-100 p-1 bg-background"
            >
              <XCircle size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const MultiSelectProp: React.FC<{
  label: string;
  value: string[];
  options: string[];
  onChange: (val: string[] | undefined) => void;
  labelWidth?: string;
}> = ({ label, value, options, onChange, labelWidth = "w-24" }) => {
  const isInherited = !value || value.length === 0;

  const toggleOption = (opt: string) => {
    const current = value || [];
    if (current.includes(opt)) {
      const next = current.filter((o) => o !== opt);
      onChange(next.length ? next : undefined);
    } else {
      onChange([...current, opt]);
    }
  };

  return (
    <div className="flex flex-col text-sm group mt-2">
      <div className="flex justify-between items-center mb-1">
        <label
          className={`${labelWidth} text-foreground/70 truncate text-xs`}
          title={label}
        >
          {label}
        </label>
        {!isInherited && (
          <button
            onClick={() => onChange(undefined)}
            className="text-foreground/40 hover:text-red-500 text-[10px]"
          >
            clear
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-1 p-2 border rounded border-border/80 bg-background min-h-[36px]">
        {options.map((opt) => {
          const selected = (value || []).includes(opt);
          return (
            <button
              key={opt}
              onClick={() => toggleOption(opt)}
              className={`px-2 py-0.5 text-[10px] rounded border ${selected ? "bg-accent/10 border-accent text-accent" : "bg-surface border-border text-foreground/60 hover:border-foreground/30"}`}
            >
              {opt}
            </button>
          );
        })}
        {options.length === 0 && (
          <span className="text-foreground/40 italic text-[10px]">
            No options available
          </span>
        )}
      </div>
    </div>
  );
};

export const StaticRowsEditor: React.FC<{
  title: string;
  rows: any[];
  colsCount: number;
  propKey: string;
  handleUpdate: (group: "props", key: string, value: any) => void;
}> = ({ title, rows, colsCount, propKey, handleUpdate }) => {
  return (
    <PropertyGroup title={title}>
      <div className="space-y-4">
        {rows.map((row: any, rIdx: number) => (
          <div
            key={row.id || rIdx}
            className="border border-border rounded p-2 bg-surface"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold">Row {rIdx + 1}</span>
              <button
                onClick={() => {
                  const newRows = [...rows];
                  newRows.splice(rIdx, 1);
                  handleUpdate("props", propKey, newRows);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <XCircle size={14} />
              </button>
            </div>
            <div className="space-y-2">
              {row.cells.map((cell: any, cIdx: number) => (
                <div
                  key={cIdx}
                  className="flex flex-col gap-2 p-2 bg-background border border-gray-100 rounded text-xs"
                >
                  <div className="flex gap-2 items-center">
                    <span className="w-10 text-foreground/50 font-medium">
                      Cell {cIdx + 1}
                    </span>
                    <NumberProp
                      label="colSpan"
                      labelWidth="w-12"
                      value={cell.colSpan}
                      onChange={(v) => {
                        const newRows = JSON.parse(JSON.stringify(rows));
                        newRows[rIdx].cells[cIdx] = {
                          ...cell,
                          colSpan: v || 1,
                        };
                        handleUpdate("props", propKey, newRows);
                      }}
                    />
                    <NumberProp
                      label="rowSpan"
                      labelWidth="w-12"
                      value={cell.rowSpan}
                      onChange={(v) => {
                        const newRows = JSON.parse(JSON.stringify(rows));
                        newRows[rIdx].cells[cIdx] = {
                          ...cell,
                          rowSpan: v || 1,
                        };
                        handleUpdate("props", propKey, newRows);
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-50">
                    <span className="text-foreground/40 w-10">Borders:</span>
                    {["Top", "Right", "Bottom", "Left"].map((side) => {
                      const propName = `border${side}` as keyof typeof cell;
                      return (
                        <label
                          key={side}
                          className="flex items-center gap-1 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={!!cell[propName]}
                            onChange={(e) => {
                              const newRows = JSON.parse(JSON.stringify(rows));
                              newRows[rIdx].cells[cIdx] = {
                                ...cell,
                                [propName]: e.target.checked,
                              };
                              handleUpdate("props", propKey, newRows);
                            }}
                          />
                          {side}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          onClick={() => {
            const newRows = [...rows];
            const newCells = Array.from({ length: colsCount }).map(
              (_, idx) => ({
                colSpan: 1,
                rowSpan: 1,
                content: [
                  {
                    id: `text-${Date.now()}-${idx}`,
                    type: "text",
                    props: { literal: "Cell" },
                    layout: {
                      paddingTop: 4,
                      paddingBottom: 4,
                    },
                  },
                ],
              })
            );
            newRows.push({
              id: `row-${Date.now()}`,
              cells: newCells,
            });
            handleUpdate("props", propKey, newRows);
          }}
          className="w-full py-1.5 border border-dashed border-border/80 text-foreground/50 rounded text-xs hover:bg-surface hover:text-foreground/90"
        >
          + Add Row
        </button>
      </div>
    </PropertyGroup>
  );
};
