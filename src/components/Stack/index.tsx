import * as React from "react";
import { Pressable, View, ViewStyle } from "react-native";

import { Theme, useThemeStyles } from "@/theme";

interface StackProps<T extends typeof View | typeof Pressable> {
  as?: T;
  align?: ViewStyle["alignItems"];
  children: React.ReactNode;
  direction: "horizontal" | "vertical";
  justify?: ViewStyle["justifyContent"];
  gap?: keyof Theme["spacing"];
  flex?: number;
}

// @see https://reactnative.dev/blog/2023/01/12/version-071#simplifying-layouts-with-flexbox-gap
export default function Stack<T extends typeof View | typeof Pressable>({
  as = View,
  align = "flex-start",
  children,
  direction,
  justify = "flex-start",
  gap,
  style,
  flex,
  ...restProps
}: StackProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof StackProps<T>>) {
  const elements = React.Children.toArray(children);

  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: align,
      flexDirection: direction === "horizontal" ? ("row" as const) : ("column" as const),
      columnGap: direction === "horizontal" && undefined !== gap ? theme.spacing[gap] : undefined,
      rowGap: direction === "vertical" && undefined !== gap ? theme.spacing[gap] : undefined,
      justifyContent: justify,
      flex: flex,
    }),
    [align, direction, gap, justify, flex]
  );

  return React.createElement(as, { ...restProps, style: [containerStyle, style], children: elements });
}
