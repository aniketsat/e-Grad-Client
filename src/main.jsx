import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { UserContextProvider } from "./Context/userContext";
import { ResultContextProvider } from "./Context/resultContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserContextProvider>
      <ResultContextProvider>
        <App />
      </ResultContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);
