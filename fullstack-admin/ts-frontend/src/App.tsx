import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useAppSelector } from "./states/hooks";
import { useMemo } from "react";
import { themeSettings } from "./theme";

function App() {
  const mode = useAppSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        Hello
      </ThemeProvider>
    </div>
  );
}

export default App;
