import { HashRouter } from "react-router-dom";
import { AppRouter } from "./router";
import { ThemeProvider } from "./ThemeProvider";

export function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <AppRouter />
      </HashRouter>
    </ThemeProvider>
  );
}
