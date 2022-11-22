import { useMemo, useState } from "react";
import { I18nManager } from "react-native";

import ThemeContext, { Direction, ThemeContextValues } from "./ThemeContext";
import * as theme from "./values";

interface ThemeContextProviderProps {
  children: React.ReactNode;
}

export default function ThemeContextProvider({ children }: ThemeContextProviderProps) {
  const [state, setState] = useState<Pick<ThemeContextValues, "appearance" | "direction" | "theme">>(() => ({
    appearance: "light",
    direction: I18nManager.isRTL ? "rtl" : "ltr",
    theme: theme,
  }));

  const contextValue = useMemo(
    () => ({
      ...state,
      setDirection: (direction: Direction) => {
        const boolRtlValue = direction === "rtl";

        I18nManager.allowRTL(boolRtlValue);
        I18nManager.forceRTL(boolRtlValue);

        setState(state => ({ ...state, direction }));
      },
    }),
    [state]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}
