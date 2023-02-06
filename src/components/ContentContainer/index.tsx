import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

interface ContentContainerProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function ContentContainer({ style, children }: ContentContainerProps) {
  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingTop: theme.spacing["20p"],
      paddingHorizontal: theme.spacing["20p"],
      flex: 1,
    }),
    []
  );
  return <View style={[containerStyle, style]}>{children}</View>;
}
