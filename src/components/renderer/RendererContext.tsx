import React, { createContext, useContext } from "react";

export interface PageContextType {
  pageNumber: number;
  pageCount: number;
}

export interface RendererContextType {
  data: any;
  pageContext?: PageContextType;
}

const RendererContext = createContext<RendererContextType | undefined>(undefined);

export const RendererProvider: React.FC<{
  data: any;
  pageContext?: PageContextType;
  children: React.ReactNode;
}> = ({ data, pageContext, children }) => {
  return (
    <RendererContext.Provider value={{ data, pageContext }}>
      {children}
    </RendererContext.Provider>
  );
};

export const useRendererContext = () => {
  const context = useContext(RendererContext);
  if (!context) {
    throw new Error("useRendererContext must be used within a RendererProvider");
  }
  return context;
};
