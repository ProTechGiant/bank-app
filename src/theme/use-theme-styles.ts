import { useMemo } from "react";

import useTheme from "./use-theme";
import * as theme from "./values";

type Theme = typeof theme;
type ThemeGenerator<T> = (theme: Theme) => T;

export default function useThemeStyles<T>(fn: ThemeGenerator<T>) {
  const { theme } = useTheme();

  return useMemo(() => fn(theme), [theme]);
}
