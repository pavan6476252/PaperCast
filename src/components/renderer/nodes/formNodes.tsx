import React, { createContext, useContext } from "react";
import {
  UnorderedListNode,
  OrderedListNode,
  CheckboxNode,
  RadioNode,
  RadioGroupNode,
  BaseNode,
} from "../../../types/schema";
import { getStyle } from "../utils/styleUtils";
import { NodeRenderer } from "../NodeRenderer";
import { NodeRegistry } from "../../../registry/NodeRegistry";
import { useRendererContext } from "../RendererContext";

const resolvePath = (obj: any, path: string) => {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

const getInteractionStyle = (isSelected?: boolean) => {
  return isSelected
    ? { outline: "2px solid #3b82f6", outlineOffset: "-2px" }
    : {};
};

interface BaseProps {
  isSelected?: boolean;
  onSelect?: (e: React.MouseEvent) => void;
}

// --- List Nodes ---
const renderListChildren = (node: BaseNode) => {
  return node.children?.map((child, index) => (
    <li key={child.id || index} style={{ marginBottom: "4px" }}>
      <NodeRenderer node={child} />
    </li>
  ));
};

const UnorderedListComponent: React.FC<
  { node: UnorderedListNode } & BaseProps
> = ({ node, isSelected, onSelect }) => (
  <ul
    style={{
      display: "flex",
      flexDirection: "column",
      ...getStyle(node),
      listStyleType: "disc",
      paddingLeft: "20px",
      ...getInteractionStyle(isSelected),
    }}
    onClick={onSelect}
  >
    {renderListChildren(node)}
  </ul>
);

const OrderedListComponent: React.FC<{ node: OrderedListNode } & BaseProps> = ({
  node,
  isSelected,
  onSelect,
}) => (
  <ol
    style={{
      display: "flex",
      flexDirection: "column",
      ...getStyle(node),
      listStyleType: "decimal",
      paddingLeft: "20px",
      ...getInteractionStyle(isSelected),
    }}
    onClick={onSelect}
  >
    {renderListChildren(node)}
  </ol>
);

// --- Form Controls ---
const CheckboxComponent: React.FC<{ node: CheckboxNode } & BaseProps> = ({
  node,
  isSelected,
  onSelect,
}) => {
  const { data } = useRendererContext();

  let label = node.props?.labelLiteral || "";
  let labelError = "";
  if (node.props?.labelBind) {
    const val = resolvePath(data, node.props.labelBind);
    if (val === undefined) {
      labelError = `[Missing Data: ${node.props.labelBind}]`;
      label = "";
    } else {
      label = String(val);
    }
  }

  let checked = node.props?.checkedLiteral || false;
  if (node.props?.checkedBind) {
    const val = resolvePath(data, node.props.checkedBind);
    checked = !!val;
  }

  return (
    <div
      style={{
        ...getStyle(node),
        display: "flex",
        alignItems: "center",
        gap: "8px",
        ...getInteractionStyle(isSelected),
      }}
      onClick={onSelect}
    >
      <input
        type="checkbox"
        checked={checked}
        readOnly
        style={{ cursor: "pointer" }}
      />
      {labelError ? (
        <label style={{ fontSize: "14px", color: "#dc2626" }}>
          {labelError}
        </label>
      ) : label ? (
        <label style={{ fontSize: "14px" }}>{label}</label>
      ) : null}
    </div>
  );
};

// --- Radio Group Context ---
const RadioGroupContext = createContext<{ name?: string }>({});

const RadioComponent: React.FC<{ node: RadioNode } & BaseProps> = ({
  node,
  isSelected,
  onSelect,
}) => {
  const { data } = useRendererContext();
  const groupCtx = useContext(RadioGroupContext);

  let label = node.props?.labelLiteral || "";
  let labelError = "";
  if (node.props?.labelBind) {
    const val = resolvePath(data, node.props.labelBind);
    if (val === undefined) {
      labelError = `[Missing Data: ${node.props.labelBind}]`;
      label = "";
    } else {
      label = String(val);
    }
  }

  let checked = node.props?.checkedLiteral || false;
  if (node.props?.checkedBind) {
    const val = resolvePath(data, node.props.checkedBind);
    checked = !!val;
  }

  const name = groupCtx.name || node.props?.name;
  const value = node.props?.value || label;

  return (
    <div
      style={{
        ...getStyle(node),
        display: "flex",
        alignItems: "center",
        gap: "8px",
        ...getInteractionStyle(isSelected),
      }}
      onClick={onSelect}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        readOnly
        style={{ cursor: "pointer" }}
      />
      {labelError ? (
        <label style={{ fontSize: "14px", color: "#dc2626" }}>
          {labelError}
        </label>
      ) : label ? (
        <label style={{ fontSize: "14px" }}>{label}</label>
      ) : null}
    </div>
  );
};

const renderChildren = (node: BaseNode) => {
  return node.children?.map((child, index) => (
    <NodeRenderer key={child.id || index} node={child} />
  ));
};

const RadioGroupComponent: React.FC<{ node: RadioGroupNode } & BaseProps> = ({
  node,
  isSelected,
  onSelect,
}) => {
  return (
    <RadioGroupContext.Provider value={{ name: node.props?.name || node.id }}>
      <div
        style={{
          ...getStyle(node),
          display: "flex",
          ...getInteractionStyle(isSelected),
        }}
        onClick={onSelect}
      >
        {renderChildren(node)}
      </div>
    </RadioGroupContext.Provider>
  );
};

// --- Registration ---
NodeRegistry.register({
  type: "ul",
  measure: () => 0,
  render: UnorderedListComponent,
});
NodeRegistry.register({
  type: "ol",
  measure: () => 0,
  render: OrderedListComponent,
});
NodeRegistry.register({
  type: "checkbox",
  measure: () => 0,
  render: CheckboxComponent,
});
NodeRegistry.register({
  type: "radio",
  measure: () => 0,
  render: RadioComponent,
});
NodeRegistry.register({
  type: "radioGroup",
  measure: () => 0,
  render: RadioGroupComponent,
});
