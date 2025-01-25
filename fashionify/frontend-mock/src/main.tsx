import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router";
import ShopContextProvider from "./context/ShopContext.tsx";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <ShopContextProvider>
            <App />
        </ShopContextProvider>
    </BrowserRouter>
);
