import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import App from "./App.jsx";
import "./index.css";
import { CryptoProvider } from "./contexts/cryptoContext";
import { Layout } from "./style/Layout";

//put the style in main when using external library style, for example import "slick-carousel/slick/slick.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter >
      <CryptoProvider>
        <Layout>
          <App />
       </Layout>
    </CryptoProvider>
    </BrowserRouter>
  </React.StrictMode>
);
