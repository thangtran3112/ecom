import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router";
import ShopContextProvider from "./context/ShopContext.tsx";
import React from "react";

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <ShopContextProvider>
                <App />
            </ShopContextProvider>
        </BrowserRouter>
    </React.StrictMode>
);
