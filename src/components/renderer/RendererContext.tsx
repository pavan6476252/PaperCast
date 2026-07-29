import React, { createContext, useContext } from "react";

export interface PageContextType {
  pageNumber: number;
  pageCount: number;
}

export interface RendererContextType {
  data: any;
  pageContext?: PageContextType;
  activeTab?: "content" | "headers" | "footers";
  location?: "body" | "header" | "footer";
}

const RendererContext = createContext<RendererContextType | undefined>(
  undefined
);

export const RendererProvider: React.FC<{
  data: any;
  pageContext?: PageContextType;
  activeTab?: "content" | "headers" | "footers";
  location?: "body" | "header" | "footer";
  children: React.ReactNode;
}> = ({ data, pageContext, activeTab, location, children }) => {
  return (
    <RendererContext.Provider
      value={{ data, pageContext, activeTab, location }}
    >
      {children}
    </RendererContext.Provider>
  );
};

export const useRendererContext = () => {
  const context = useContext(RendererContext);
  if (!context) {
    throw new Error(
      "useRendererContext must be used within a RendererProvider"
    );
  }
  return context;
};
