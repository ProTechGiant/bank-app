import { cloneElement } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface QuickActionItemProps {
  title: string;
  icon?: React.ReactElement<SvgProps>;
  onPress: () => void;
}

export default function QuickActionItem({ title, icon, onPress }: QuickActionItemProps) {
  const IconContainer = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    backgroundColor: theme.palette["supportBase-15"],
    borderRadius: theme.radii.medium,
  }));

  const addBillStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["4p"],
  }));

  const iconColor = useThemeStyles(t => t.palette.primaryBase);

  return (
    <Pressable onPress={onPress}>
      <Stack direction="vertical" gap="8p" align="center" justify="space-between">
        <View style={IconContainer}>{icon !== undefined ? cloneElement(icon, { color: iconColor }) : null}</View>

        <Stack align="baseline" direction="vertical" gap="8p">
          <Typography.Text
            numberOfLines={2}
            lineBreakMode="clip"
            style={addBillStyle}
            size="caption1"
            align="center"
            weight="regular"
            color="neutralBase">
            {title}
          </Typography.Text>
        </Stack>
      </Stack>
    </Pressable>
  );
}
