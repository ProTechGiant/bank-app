import { ReactNode } from "react";
import { ScrollView, StyleProp, View, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

interface ContentContainerProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  isScrollView?: boolean;
}

export default function ContentContainer({ style, children, isScrollView = false }: ContentContainerProps) {
  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingTop: theme.spacing["20p"],
      paddingHorizontal: theme.spacing["20p"],
      flex: 1,
    }),
    []
  );

  return isScrollView ? (
    <ScrollView style={[containerStyle, style]}>{children}</ScrollView>
  ) : (
    <View style={[containerStyle, style]}>{children}</View>
  );
}
