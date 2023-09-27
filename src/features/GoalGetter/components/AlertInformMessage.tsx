import React from "react";
import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface AlertMessageProps {
  contentMessage: string;
}

export default function AlertInformMessage({ contentMessage }: AlertMessageProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderColor: theme.palette["primaryBase-40"],
    borderStartWidth: 4,
    borderTopRightRadius: theme.radii.extraSmall,
    borderBottomRightRadius: theme.radii.extraSmall,
    padding: theme.spacing["16p"],
    marginBottom: theme.spacing["24p"],
    backgroundColor: theme.palette["supportBase-20"],
  }));

  return (
    <View style={containerStyle}>
      <Typography.Text size="caption2">{contentMessage}</Typography.Text>
    </View>
  );
}
