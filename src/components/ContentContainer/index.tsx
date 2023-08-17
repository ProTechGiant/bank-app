import { ReactNode } from "react";
import { ScrollView, ScrollViewProps, StyleProp, View, ViewProps, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

interface ContentContainerProps extends ViewProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  isScrollView?: boolean;
  keyboardShouldPersistTaps?: ScrollViewProps["keyboardShouldPersistTaps"];
  alwaysBounceVertical?: boolean;
}

export default function ContentContainer({
  style,
  children,
  isScrollView = false,
  keyboardShouldPersistTaps,
  ...restProps
}: ContentContainerProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["20p"],
    flexGrow: 1,
  }));

  return isScrollView ? (
    <ScrollView
      {...restProps}
      contentContainerStyle={[containerStyle, style]}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}>
      {children}
    </ScrollView>
  ) : (
    <View {...restProps} style={[containerStyle, style]}>
      {children}
    </View>
  );
}
