import { ReactNode } from "react";
import { ScrollView, ScrollViewProps, StyleProp, View, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

interface ContentContainerProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  isScrollView?: boolean;
  keyboardShouldPersistTaps?: ScrollViewProps["keyboardShouldPersistTaps"];
}

export default function ContentContainer({
  style,
  children,
  isScrollView = false,
  keyboardShouldPersistTaps,
}: ContentContainerProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["20p"],
    flexGrow: 1,
  }));

  return isScrollView ? (
    <ScrollView contentContainerStyle={[containerStyle, style]} keyboardShouldPersistTaps={keyboardShouldPersistTaps}>
      {children}
    </ScrollView>
  ) : (
    <View style={[containerStyle, style]}>{children}</View>
  );
}
