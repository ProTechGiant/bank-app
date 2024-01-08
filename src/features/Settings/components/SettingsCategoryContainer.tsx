import React, { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface SectionDividerProps {
  children: ReactNode;
  categoryName?: string;
  style?: StyleProp<ViewStyle>;
}

export default function SettingsCategoryContainer({ children, categoryName, style }: SectionDividerProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
    rowGap: theme.spacing["24p"],
  }));

  return (
    <View style={[containerStyle, style]}>
      {categoryName ? (
        <Typography.Text size="title3" weight="medium">
          {categoryName}
        </Typography.Text>
      ) : null}
      {children}
    </View>
  );
}
