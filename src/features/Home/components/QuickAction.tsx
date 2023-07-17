import { cloneElement } from "react";
import { Pressable, useWindowDimensions, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import { WithShadow } from "@/components";
import Typography from "@/components/Typography";
import { Theme, useThemeStyles } from "@/theme";

interface QuickActionProps {
  color: keyof Theme["palette"];
  icon: React.ReactElement<SvgProps | IconProps>;
  title: string;
  onPress: () => void;
}

export default function QuickAction({ color, icon, title, onPress }: QuickActionProps) {
  const windowDimensions = useWindowDimensions();

  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      gap: theme.spacing["12p"],
      paddingHorizontal: theme.spacing["12p"],
      alignItems: "center",
      width: (windowDimensions.width - theme.spacing["12p"] * 2) / 4,
    }),
    [windowDimensions]
  );

  const iconStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
  }));

  const rawColor = useThemeStyles(theme => theme.palette[color], [color]);

  return (
    <Pressable onPress={onPress} style={containerStyle}>
      <WithShadow backgroundColor="neutralBase-60" borderRadius="xxlarge">
        <View style={iconStyle}>{cloneElement(icon, { color: rawColor, height: 24, width: 24 })}</View>
      </WithShadow>
      <Typography.Text color="neutralBase+10" size="caption2" weight="medium">
        {title}
      </Typography.Text>
    </Pressable>
  );
}
