import { createContext } from "react";

import * as theme from "./values";

export type Appearance = "light" | "dark";
export type Direction = "ltr" | "rtl";
export type Theme = typeof theme;

export interface ThemeContextValues {
  appearance: Appearance;
  direction: Direction;
  setDirection: (value: Direction) => void;
  theme: Theme;
}

export default createContext<ThemeContextValues>({
  theme,
  appearance: "light",
  direction: "ltr",
  setDirection: () => {
    // eslint-disable-next-line no-console
    console.error("Woops! ThemeContext.Provider is not available");
  },
});
