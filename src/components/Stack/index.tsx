import * as React from "react";
import { View, ViewProps, ViewStyle } from "react-native";

import { Theme, useThemeStyles } from "@/theme";

interface StackProps extends ViewProps {
  align?: ViewStyle["alignItems"];
  children: React.ReactNode;
  direction: "horizontal" | "vertical";
  justify?: ViewStyle["justifyContent"];
  gap?: keyof Theme["spacing"] | undefined;
}

// @see https://reactnative.dev/blog/2023/01/12/version-071#simplifying-layouts-with-flexbox-gap
export default function Stack({
  align = "flex-start",
  children,
  direction,
  justify = "flex-start",
  gap,
  style,
  ...restProps
}: StackProps) {
  const elements = React.Children.toArray(children);

  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: align,
      flexDirection: direction === "horizontal" ? ("row" as const) : ("column" as const),
      columnGap: direction === "horizontal" && undefined !== gap ? theme.spacing[gap] : undefined,
      rowGap: direction === "vertical" && undefined !== gap ? theme.spacing[gap] : undefined,
      justifyContent: justify,
    }),
    [align, direction, gap, justify]
  );

  return (
    <View {...restProps} style={[containerStyle, style]}>
      {elements}
    </View>
  );
}
