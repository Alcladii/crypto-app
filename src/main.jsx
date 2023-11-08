import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { CryptoProvider } from "./contexts/cryptoContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CryptoProvider>
      <App />
    </CryptoProvider>
  </React.StrictMode>
);
