import * as React from "react";
import { ViewStyle } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

import { Theme, useThemeStyles } from "@/theme";

interface PageProps {
  backgroundColor?: keyof Theme["palette"];
  children: React.ReactNode;
  insets?: Edge[];
}

export default function Page({ backgroundColor, children, insets = undefined }: PageProps) {
  const containerStyles = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: undefined !== backgroundColor ? theme.palette[backgroundColor] : undefined,
      flex: 1,
    }),
    [backgroundColor]
  );

  return (
    <SafeAreaView edges={insets} style={containerStyles}>
      {children}
    </SafeAreaView>
  );
}
