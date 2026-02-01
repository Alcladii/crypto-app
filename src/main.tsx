import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from "./App.tsx";
import "./index.css";
import { CryptoProvider } from "./contexts/GlobalContext.tsx";
import { Layout } from "./style/Layout";
import {App2} from "./App2.tsx"

const queryClient = new QueryClient();

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

//put the style in main when using external library style, for example import "slick-carousel/slick/slick.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <CryptoProvider>
          <Layout>
            <App />
            <App2 />
          </Layout>
        </CryptoProvider>
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </BrowserRouter>
  </ClerkProvider>
);
