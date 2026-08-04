import React, { createContext, useContext } from "react";
import {
  UnorderedListNode,
  OrderedListNode,
  CheckboxNode,
  RadioNode,
  RadioGroupNode,
  AnyNode,
} from "@papercast/core";
import { NodeRenderer } from "../NodeRenderer";
import { ComponentTypeDefinition } from "../registry";
import { useNodeData } from "../headless/useNodeData";
import { useNodeStyle } from "../headless/useNodeStyle";

interface BaseProps {
  injectedProps?: React.HTMLAttributes<HTMLDivElement> & {
    "data-selected"?: boolean;
  };
  pageContext?: { pageNumber: number; pageCount: number };
}

const renderListChildren = (node: AnyNode) => {
  return node.children?.map((child, index) => (
    <li key={child.id || index}>
      <NodeRenderer node={child} />
    </li>
  ));
};

const UnorderedListComponent: React.FC<
  { node: UnorderedListNode } & BaseProps
> = ({ node, injectedProps }) => {
  const style = useNodeStyle(node, injectedProps);
  return (
    <ul
      {...(injectedProps as any)}
      style={{
        display: "flex",
        flexDirection: "column",
        listStyleType: "disc",
        paddingLeft: "20px",
        ...style,
      }}
    >
      {renderListChildren(node)}
    </ul>
  );
};

const OrderedListComponent: React.FC<{ node: OrderedListNode } & BaseProps> = ({
  node,
  injectedProps,
}) => {
  const style = useNodeStyle(node, injectedProps);
  return (
    <ol
      {...(injectedProps as any)}
      style={{
        display: "flex",
        flexDirection: "column",
        listStyleType: "decimal",
        paddingLeft: "20px",
        ...style,
      }}
    >
      {renderListChildren(node)}
    </ol>
  );
};

// --- Form Controls ---
const CheckboxComponent: React.FC<{ node: CheckboxNode } & BaseProps> = ({
  node,
  injectedProps,
}) => {
  const { resolve } = useNodeData();
  const style = useNodeStyle(node, injectedProps);

  let label = node.props?.labelLiteral || "";
  let labelError = "";
  if (node.props?.labelBind) {
    const val = resolve(node.props.labelBind);
    if (val === undefined) {
      labelError = `[Missing Data: ${node.props.labelBind}]`;
    } else {
      label = String(val);
    }
  }

  let checked = node.props?.checkedLiteral || false;
  if (node.props?.checkedBind) {
    checked = !!resolve(node.props.checkedBind);
  }

  return (
    <div
      {...injectedProps}
      style={{ display: "flex", alignItems: "center", gap: "8px", ...style }}
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
  injectedProps,
}) => {
  const { resolve } = useNodeData();
  const style = useNodeStyle(node, injectedProps);
  const groupCtx = useContext(RadioGroupContext);

  let label = node.props?.labelLiteral || "";
  let labelError = "";
  if (node.props?.labelBind) {
    const val = resolve(node.props.labelBind);
    if (val === undefined) {
      labelError = `[Missing Data: ${node.props.labelBind}]`;
    } else {
      label = String(val);
    }
  }

  let checked = node.props?.checkedLiteral || false;
  if (node.props?.checkedBind) {
    checked = !!resolve(node.props.checkedBind);
  }

  const name = groupCtx.name || node.props?.name;
  const value = node.props?.value || label;

  return (
    <div
      {...injectedProps}
      style={{ display: "flex", alignItems: "center", gap: "8px", ...style }}
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

const renderChildren = (node: AnyNode) => {
  return node.children?.map((child, index) => (
    <NodeRenderer key={child.id || index} node={child} />
  ));
};

const RadioGroupComponent: React.FC<{ node: RadioGroupNode } & BaseProps> = ({
  node,
  injectedProps,
}) => {
  const style = useNodeStyle(node, injectedProps);
  return (
    <RadioGroupContext.Provider value={{ name: node.props?.name || node.id }}>
      <div {...injectedProps} style={{ display: "flex", ...style }}>
        {renderChildren(node)}
      </div>
    </RadioGroupContext.Provider>
  );
};

export const formNodes: ComponentTypeDefinition<any>[] = [
  { type: "ul", measure: () => 0, render: UnorderedListComponent },
  { type: "ol", measure: () => 0, render: OrderedListComponent },
  { type: "checkbox", measure: () => 0, render: CheckboxComponent },
  { type: "radio", measure: () => 0, render: RadioComponent },
  { type: "radioGroup", measure: () => 0, render: RadioGroupComponent },
];
