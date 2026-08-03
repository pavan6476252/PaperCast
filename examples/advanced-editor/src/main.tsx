import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { registerDefaultWidgets } from "@formcast/react/widgets";

// Register the standard node types (text, row, column, etc.)
registerDefaultWidgets();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
