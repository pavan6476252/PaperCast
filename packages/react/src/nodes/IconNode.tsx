import React from "react";
import { IconNode as IconNodeType } from "@papercast/core";
import { useNodeStyle } from "../headless/useNodeStyle";
import * as LucideIcons from "lucide-react";

interface IconNodeProps {
  node: IconNodeType;
  injectedProps?: React.HTMLAttributes<HTMLDivElement> & {
    "data-selected"?: boolean;
  };
}

export const IconNode: React.FC<IconNodeProps> = ({ node, injectedProps }) => {
  const style = useNodeStyle(node, injectedProps);

  const rawIconName = node.props?.iconName || "HelpCircle";

  // Try exact match first
  let IconComponent = (
    LucideIcons as unknown as Record<string, React.ElementType>
  )[rawIconName];

  // If not found, try kebab-to-pascal conversion
  if (!IconComponent && rawIconName.includes("-")) {
    const pascal = rawIconName
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join("");
    IconComponent = (
      LucideIcons as unknown as Record<string, React.ElementType>
    )[pascal];
  }

  // If still not found, do a case-insensitive search (strip dashes/spaces)
  if (!IconComponent) {
    const normalizedTarget = rawIconName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const matchedKey = Object.keys(LucideIcons).find(
      (k) => k.toLowerCase() === normalizedTarget
    );
    if (matchedKey) {
      IconComponent = (
        LucideIcons as unknown as Record<string, React.ElementType>
      )[matchedKey];
    }
  }

  if (!IconComponent) {
    return (
      <div
        style={{ ...style, color: "red", border: "1px dashed red" }}
        {...injectedProps}
      >
        Unknown Icon: {rawIconName}
      </div>
    );
  }

  const size = node.props?.sizePx || style.fontSize || 24;
  const color = node.props?.color || style.color || "currentColor";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
      {...injectedProps}
    >
      <IconComponent size={size} color={color} />
    </div>
  );
};
