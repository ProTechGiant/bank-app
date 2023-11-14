import { ReactElement } from "react";
import { ColorValue, Pressable, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

interface AllInOneTagProps {
  label: string;
  backgroundColor: ColorValue;
  icon: ReactElement;
}

export default function RewardsAction({ label, backgroundColor: tagBackgroundColor, icon }: AllInOneTagProps) {
  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: tagBackgroundColor,
    borderRadius: theme.radii.xlarge,
    paddingVertical: theme.spacing["4p"],
    paddingHorizontal: theme.spacing["16p"],
  }));

  return (
    <Pressable>
      <Stack style={contentStyle} direction="horizontal" align="center" gap="8p">
        {icon}
        <Typography.Text size="caption1" weight="semiBold" color="neutralBase-50">
          {label}
        </Typography.Text>
      </Stack>
    </Pressable>
  );
}
