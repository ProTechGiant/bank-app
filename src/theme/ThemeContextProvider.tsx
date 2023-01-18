import { useState } from "react";

import ThemeContext, { ThemeContextValues } from "./ThemeContext";
import * as theme from "./values";

interface ThemeContextProviderProps {
  children: React.ReactNode;
}

export default function ThemeContextProvider({ children }: ThemeContextProviderProps) {
  const [state, _setState] = useState<ThemeContextValues>(() => ({
    appearance: "light",
    theme: theme,
  }));

  return <ThemeContext.Provider value={state}>{children}</ThemeContext.Provider>;
}
