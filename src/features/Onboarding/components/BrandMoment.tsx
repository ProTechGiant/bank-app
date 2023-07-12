import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface BrandMomentProps {
  title: string;
  adjustFontSizeToFit?: boolean;
  style: StyleProp<ViewStyle>;
}

export default function BrandMoment({ style, title, adjustFontSizeToFit }: BrandMomentProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing["4p"],
  }));

  return (
    <View style={[containerStyle, style]}>
      <Typography.Text
        size="callout"
        color="neutralBase-60"
        align="center"
        weight="medium"
        adjustsFontSizeToFit={adjustFontSizeToFit}>
        {title}
      </Typography.Text>
    </View>
  );
}
