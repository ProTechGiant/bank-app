import { useMemo } from "react";

import { Theme } from ".";
import useTheme from "./use-theme";

type ThemeGenerator<T> = (theme: Theme) => T;

export default function useThemeStyles<T>(fn: ThemeGenerator<T>, deps: React.DependencyList = []) {
  const { theme } = useTheme();

  return useMemo(() => fn(theme), [theme, ...deps]);
}
