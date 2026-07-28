export interface DocPageDef {
  id: string;
  title: string;
  description: string;
}

export interface DocCategory {
  title: string;
  pages: DocPageDef[];
}

export const DOC_CATEGORIES: DocCategory[] = [
  {
    title: "Getting Started",
    pages: [
      { id: "getting-started", title: "Getting Started", description: "Learn the basics of FormCast and how to build your first document." },
    ]
  },
  {
    title: "Basic Usage",
    pages: [
      { id: "builder-interface", title: "Builder Interface", description: "A complete tour of the visual builder UI." },
      { id: "keyboard-shortcuts", title: "Keyboard Shortcuts", description: "Global keyboard shortcuts and toolbar reference." },
      { id: "adding-widgets", title: "Adding Widgets", description: "How to use drag-and-drop to build your document structure." },
      { id: "styling-elements", title: "Styling Elements", description: "Using the property panel to style your nodes." }
    ]
  },
  {
    title: "Advanced Usage",
    pages: [
      { id: "auto-pagination", title: "Auto-Pagination", description: "Controlling how your content breaks across pages." },
      { id: "data-binding", title: "Data Binding", description: "Injecting dynamic JSON data into your templates." },
      { id: "headers-and-footers-usage", title: "Headers & Footers", description: "Setting up recurring and cover-page headers." }
    ]
  },
  {
    title: "Widget Reference",
    pages: [
      { id: "layout-widgets", title: "Layout Widgets", description: "Row, Column, Spacer, and Divider." },
      { id: "content-widgets", title: "Content Widgets", description: "Text, RichText, and Image." },
      { id: "list-and-table-widgets", title: "Lists & Tables", description: "Ordered, Unordered, and Data Tables." },
      { id: "form-widgets", title: "Form Controls", description: "Checkboxes, Radios, and RadioGroups." }
    ]
  },
  {
    title: "Developer Guide",
    pages: [
      { id: "architecture-overview", title: "Architecture Overview", description: "High-level overview of FormCast rendering flow." },
      { id: "pdf-export-architecture", title: "PDF Export Workflow", description: "Serverless Puppeteer and print routing." },
      { id: "pagination-engine", title: "Pagination Engine", description: "Deep dive into auto-pagination and offscreen measurement." },
      { id: "rendering-context", title: "Rendering Context", description: "React context bridging the UI and PDF generation." },
      { id: "calculations-and-logic", title: "Calculations & Logic", description: "How variables, math, and templates are resolved." },
      { id: "node-registry", title: "Node Registry", description: "How components are decoupled and registered." },
      { id: "widget-system", title: "Widget System", description: "DnD widgets, basic nodes, and rich text architecture." },
      { id: "headers-and-footers", title: "Headers & Footers", description: "Dynamic page header and footer injection." },
      { id: "typescript-schemas", title: "TypeScript Schemas", description: "Data contracts, DocNode, and StyleProperties definitions." },
      { id: "state-management", title: "State Management", description: "Zustand store for AST and validation." },
      { id: "property-panel", title: "Property Panel", description: "Visual binding and AST manipulation." },
      { id: "ast-manipulation", title: "AST Manipulation", description: "Safe structural and property edits on the JSON state." },
      { id: "json-editor", title: "JSON Editor", description: "Monaco integration and real-time schema validation." },
      { id: "templates-and-test-data", title: "Templates & Test Data", description: "How to manage and add showcase templates." },
      { id: "documentation-site", title: "Documentation Site", description: "How this marketing and docs site works." }
    ]
  }
];

export const DOC_PAGES = DOC_CATEGORIES.flatMap(cat => cat.pages);

export function getDocPageById(id: string) {
  return DOC_PAGES.find((page) => page.id === id);
}

export function getNextPage(id: string) {
  const currentIndex = DOC_PAGES.findIndex((page) => page.id === id);
  if (currentIndex === -1 || currentIndex === DOC_PAGES.length - 1) return null;
  return DOC_PAGES[currentIndex + 1];
}

export function getPrevPage(id: string) {
  const currentIndex = DOC_PAGES.findIndex((page) => page.id === id);
  if (currentIndex <= 0) return null;
  return DOC_PAGES[currentIndex - 1];
}
