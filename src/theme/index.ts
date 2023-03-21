import generateShadow from "./generate-shadow";
import useTheme from "./use-theme";
import useThemeStyles from "./use-theme-styles";
import * as theme from "./values";

export type Appearance = "light" | "dark";
export type Direction = "ltr" | "rtl";
export type Theme = typeof theme;

export { generateShadow, useTheme, useThemeStyles };
