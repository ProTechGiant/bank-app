import { cloneElement } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import { WithShadow } from "@/components";
import Typography from "@/components/Typography";
import { Theme, useThemeStyles } from "@/theme";

interface QuickActionProps {
  color: keyof Theme["palette"];
  icon: React.ReactElement<SvgProps | IconProps>;
  title: string;
  onPress?: () => void;
  withTitle?: boolean;
}

export default function QuickAction({ color, icon, title, onPress, withTitle = true }: QuickActionProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["12p"],
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  }));

  const iconStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
  }));
  const rawColor = useThemeStyles(theme => theme.palette[color], [color]);

  return (
    <Pressable onPress={onPress} style={containerStyle}>
      <WithShadow backgroundColor="neutralBase-60" borderRadius="xxlarge">
        <View style={iconStyle}>{cloneElement(icon, { color: rawColor, height: 24, width: 24 })}</View>
      </WithShadow>
      {withTitle ? (
        <Typography.Text color="neutralBase+10" size="caption2" weight="medium">
          {title}
        </Typography.Text>
      ) : null}
    </Pressable>
  );
}
