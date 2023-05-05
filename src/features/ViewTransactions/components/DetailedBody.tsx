import React, { ReactNode } from "react";
import { View, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

interface DetailedBodyProps {
  children: ReactNode;
}

export default function DetailedBody({ children }: DetailedBodyProps) {
  const body = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
  }));

  return <View style={body}>{children}</View>;
}
