import { cloneElement } from "react";
import { Pressable, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { Theme, useThemeStyles } from "@/theme";
import { iconMapping } from "@/utils/icon-mapping";

interface QuickActionProps {
  color: keyof Theme["palette"];
  backgroundColor?: keyof Theme["palette"];
  title?: string;
  iconName?: string;
  onPress?: () => void;
  testID?: string;
}

export default function QuickAction({
  color,
  iconName,
  title,
  backgroundColor = "supportBase-10",
  onPress,
  testID,
}: QuickActionProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["12p"],
    alignItems: "center",
    flex: 1,
  }));

  const iconBackgroundColor = useThemeStyles(theme => theme.palette[backgroundColor], [backgroundColor]);

  const iconStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    backgroundColor: iconBackgroundColor,
    borderRadius: theme.radii.xxlarge,
  }));

  const rawColor = useThemeStyles(theme => theme.palette[color], [color]);

  return (
    <Pressable
      testID={testID !== undefined ? `${testID}-QuickActionPressed` : undefined}
      onPress={onPress}
      style={containerStyle}>
      <View style={iconStyle}>
        {cloneElement(iconMapping.homepageQuickActions[`${iconName}`] ?? iconMapping.homepageQuickActions.croatiaIcon, {
          color: rawColor,
          height: 24,
          width: 24,
        })}
      </View>
      {title !== undefined ? (
        <Typography.Text color="neutralBase+10" size="caption2" weight="medium" align="center">
          {title}
        </Typography.Text>
      ) : null}
    </Pressable>
  );
}
