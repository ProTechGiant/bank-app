import { View, ViewStyle } from "react-native";

import { Typography } from "@/components";
import { Theme, useThemeStyles } from "@/theme";

interface ActivateCardProps {
  label: string;
  backgroundColor: keyof Theme["palette"];
}

export default function ActivateCard({ label, backgroundColor: tagBackgroundColor }: ActivateCardProps) {
  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette[tagBackgroundColor],
    borderRadius: theme.radii.xlarge,
    paddingVertical: theme.spacing["8p"],
    paddingHorizontal: theme.spacing["16p"],
  }));

  return (
    <View style={contentStyle}>
      <Typography.Text size="caption1" weight="semiBold">
        {label}
      </Typography.Text>
    </View>
  );
}
