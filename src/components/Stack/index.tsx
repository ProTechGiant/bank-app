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

  const containerStyle = React.useMemo(
    () => ({
      alignItems: align,
      flexDirection: direction === "horizontal" ? ("row" as const) : ("column" as const),
      justifyContent: justify,
    }),
    [align, direction, justify]
  );

  const elementStyle = useThemeStyles(
    theme => {
      if (undefined === gap) return undefined;

      const marginDirection = direction === "horizontal" ? "marginRight" : "marginBottom";
      return { [marginDirection]: theme.spacing[gap] };
    },
    [direction, gap]
  );

  return (
    <View {...restProps} style={[containerStyle, style]}>
      {elements.map((element, index) => {
        return (
          <View key={index} style={[elements.length - 1 !== index ? elementStyle : undefined, { width: "100%" }]}>
            {element}
          </View>
        );
      })}
    </View>
  );
}
