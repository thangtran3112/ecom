import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useAppSelector } from "./states/hooks";
import { useMemo } from "react";
import { themeSettings } from "./theme";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./scenes/layout/Layout";
import Dashboard from "./scenes/dashboard/Dashboard";
import Products from "./scenes/products/Products";
import Customers from "./scenes/customers/Customers";
import Transactions from "./scenes/transactions/Transactions";

function App() {
  const mode = useAppSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/transactions" element={<Transactions />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
