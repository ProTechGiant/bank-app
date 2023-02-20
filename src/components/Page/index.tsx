import * as React from "react";
import { Platform, ViewStyle } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

import { Theme, useThemeStyles } from "@/theme";

interface PageProps {
  backgroundColor?: keyof Theme["palette"];
  children: React.ReactNode;
  insets?: Edge[];
  isPadded?: boolean;
}

function Page({ backgroundColor, children, insets = undefined, isPadded = true }: PageProps) {
  const containerStyles = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: undefined !== backgroundColor ? theme.palette[backgroundColor] : undefined,
      flex: 1,
    }),
    [backgroundColor]
  );

  const bottomPadding = useThemeStyles<ViewStyle>(({ spacing }) => ({
    paddingBottom: spacing["16p"],
  }));

  return (
    <SafeAreaView edges={insets} style={[containerStyles, isPadded && Platform.OS === "android" && bottomPadding]}>
      {children}
    </SafeAreaView>
  );
}

export default Page;
