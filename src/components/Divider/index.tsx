import * as React from "react";
import { View, ViewStyle } from "react-native";

import { Theme, useThemeStyles } from "@/theme";

interface DividerProps {
  color?: keyof Theme["palette"];
  height?: number | string;
}

export default function Divider({ color, height = 1 }: DividerProps) {
  const containerStyles = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: undefined !== color ? theme.palette[color] : undefined,
      height: height,
    }),
    [color]
  );

  return <View style={containerStyles} />;
}
