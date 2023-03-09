import { cloneElement } from "react";
import { Pressable, useWindowDimensions, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
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
      backgroundColor: theme.palette["neutralBase-60"],
      borderRadius: theme.radii.extraSmall,
      rowGap: theme.spacing["12p"],
      paddingHorizontal: theme.spacing["12p"],
      paddingVertical: theme.spacing["20p"],
      width: windowDimensions.width / 3 - theme.spacing["20p"],
    }),
    [windowDimensions]
  );

  const shadowStyle = useThemeStyles<ViewStyle>(theme => ({
    shadowColor: theme.palette.primaryBase,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.14,
    elevation: 5,
  }));

  const rawColor = useThemeStyles(theme => theme.palette[color], [color]);

  return (
    <Pressable onPress={onPress} style={[containerStyle, shadowStyle]}>
      {cloneElement(icon, { color: rawColor, height: 22, width: 22 })}
      <Typography.Text color={color} size="footnote" weight="bold">
        {title}
      </Typography.Text>
    </Pressable>
  );
}
