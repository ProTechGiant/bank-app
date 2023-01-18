import { createContext } from "react";

import * as theme from "./values";

export type Appearance = "light" | "dark";
export type Theme = typeof theme;

export interface ThemeContextValues {
  appearance: Appearance;
  theme: Theme;
}

export default createContext<ThemeContextValues>({
  theme,
  appearance: "light",
});
