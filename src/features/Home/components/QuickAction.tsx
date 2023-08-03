import { cloneElement } from "react";
import { ImageStyle, Pressable, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import { WithShadow } from "@/components";
import NetworkImage from "@/components/NetworkImage";
import Typography from "@/components/Typography";
import { Theme, useThemeStyles } from "@/theme";

interface QuickActionProps {
  color: keyof Theme["palette"];
  backgroundColor?: keyof Theme["palette"];
  title?: string;
  icon?: React.ReactElement<SvgProps | IconProps>;
  image?: string;
  onPress?: () => void;
}

export default function QuickAction({
  color,
  icon,
  image,
  title,
  backgroundColor = "neutralBase-60",
  onPress,
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

  const imageStyle = useThemeStyles<ImageStyle>(theme => ({
    width: theme.spacing["24p"],
    height: theme.spacing["24p"],
    tintColor: rawColor,
  }));

  return (
    <Pressable onPress={onPress} style={containerStyle}>
      <WithShadow backgroundColor="neutralBase-60" borderRadius="xxlarge">
        <View style={iconStyle}>
          {icon !== undefined ? (
            cloneElement(icon, { color: rawColor, height: 24, width: 24 })
          ) : image !== null && image !== undefined ? (
            <NetworkImage source={{ uri: image }} style={imageStyle} />
          ) : (
            <View style={imageStyle} />
          )}
        </View>
      </WithShadow>
      {title !== undefined ? (
        <Typography.Text color="neutralBase+10" size="caption2" weight="medium" align="center">
          {title}
        </Typography.Text>
      ) : null}
    </Pressable>
  );
}
