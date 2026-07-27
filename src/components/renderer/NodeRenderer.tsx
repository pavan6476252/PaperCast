import React from "react";
import { BaseNode } from "../../types/schema";
import { NodeRegistry } from "../../registry/NodeRegistry";
import { useDocumentStore } from "../../store/documentStore";

export interface PageContext {
  pageNumber: number;
  pageCount: number;
}

interface NodeRendererProps {
  node: BaseNode;
  path?: string;
  pageContext?: PageContext;
}

export const NodeRenderer: React.FC<NodeRendererProps> = ({ node, path, pageContext }) => {
  const def = NodeRegistry.get(node.type);
  const selectedNodeId = useDocumentStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useDocumentStore((state) => state.setSelectedNodeId);

  const isSelected = selectedNodeId === node.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNodeId(node.id);
  };

  if (!def) {
    return (
      <div 
        style={{ color: "red", border: "1px solid red", padding: 4 }}
        onClick={handleClick}
      >
        Unknown node type: {node.type}
      </div>
    );
  }

  const Component = def.render;

  return (
    <Component 
      node={node} 
      path={path} 
      isSelected={isSelected} 
      onSelect={handleClick} 
      pageContext={pageContext}
    />
  );
};
