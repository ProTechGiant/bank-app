import { ReactNode } from "react";
import { ScrollView, StyleProp, View, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

interface ContentContainerProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  isScrollView?: boolean;
}

export default function ContentContainer({ style, children, isScrollView = false }: ContentContainerProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["20p"],
    flexGrow: 1,
  }));

  return isScrollView ? (
    <ScrollView contentContainerStyle={[containerStyle, style]}>{children}</ScrollView>
  ) : (
    <View style={[containerStyle, style]}>{children}</View>
  );
}
