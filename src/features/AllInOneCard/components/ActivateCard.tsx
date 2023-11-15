import { View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { Theme, useThemeStyles } from "@/theme";

interface ActivateCardProps {
  label: string;
  backgroundColor: keyof Theme["palette"];
  color?: keyof Theme["palette"];
  icon?: JSX.Element;
}

export default function ActivateCard({
  label,
  backgroundColor: tagBackgroundColor,
  icon,
  color = "neutralBase+30",
}: ActivateCardProps) {
  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette[tagBackgroundColor],
    borderRadius: theme.radii.xlarge,
    paddingVertical: theme.spacing["8p"],
    paddingHorizontal: theme.spacing["16p"],
  }));

  return (
    <View style={contentStyle}>
      <Stack direction="horizontal" gap="8p">
        {icon}
        <Typography.Text size="callout" weight="semiBold" color={color}>
          {label}
        </Typography.Text>
      </Stack>
    </View>
  );
}
