import * as React from "react";
import { View, ViewStyle } from "react-native";

import { Theme, useThemeStyles } from "@/theme";

interface DividerProps {
  color?: keyof Theme["palette"];
  height?: number | string;
  style?: ViewStyle;
}

export default function Divider({ color, height = 1, style }: DividerProps) {
  const containerStyles = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: undefined !== color ? theme.palette[color] : undefined,
      height: height,
      ...style,
    }),
    [color]
  );

  return <View style={containerStyles} />;
}
