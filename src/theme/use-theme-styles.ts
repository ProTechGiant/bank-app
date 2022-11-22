import { useMemo } from "react";

import useTheme from "./use-theme";
import * as theme from "./values";

type Theme = typeof theme;
type ThemeGenerator<T extends {}> = (theme: Theme) => T;

export default function useThemeStyles<T extends {}>(fn: ThemeGenerator<T>) {
  const { theme } = useTheme();

  return useMemo(() => fn(theme), [theme]);
}
