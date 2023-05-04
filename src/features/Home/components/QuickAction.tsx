import { cloneElement } from "react";
import { Pressable, useWindowDimensions, ViewStyle } from "react-native";
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
      rowGap: theme.spacing["12p"],
      paddingHorizontal: theme.spacing["12p"],
      paddingVertical: theme.spacing["20p"],
      width: windowDimensions.width / 3 - theme.spacing["20p"],
    }),
    [windowDimensions]
  );

  const rawColor = useThemeStyles(theme => theme.palette[color], [color]);

  return (
    <WithShadow backgroundColor="neutralBase-60" borderRadius="extraSmall">
      <Pressable onPress={onPress} style={containerStyle}>
        {cloneElement(icon, { color: rawColor, height: 22, width: 22 })}
        <Typography.Text color={color} size="footnote" weight="bold">
          {title}
        </Typography.Text>
      </Pressable>
    </WithShadow>
  );
}
