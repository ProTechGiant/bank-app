import { View, ViewStyle } from "react-native";

import { Typography } from "@/components";
import { useThemeStyles } from "@/theme";

interface AllInOneTagProps {
  label: string;
  backgroundColor: string;
}

export default function AllInOneTag({ label, backgroundColor: tagBackgroundColor }: AllInOneTagProps) {
  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: tagBackgroundColor,
    borderRadius: theme.radii.small,
    paddingVertical: theme.spacing["4p"],
    paddingHorizontal: theme.spacing["8p"],
  }));

  return (
    <View style={contentStyle}>
      <Typography.Text size="caption1" weight="semiBold">
        {label}
      </Typography.Text>
    </View>
  );
}
