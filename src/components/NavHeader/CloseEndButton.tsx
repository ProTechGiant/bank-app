import { I18nManager, Pressable } from "react-native";

import { CloseIcon } from "@/assets/icons";
import { Theme, useThemeStyles } from "@/theme";

export interface CloseEndButtonProps {
  color?: keyof Theme["palette"];
  onPress: () => void;
}

export default function CloseEndButton({ color = "primaryBase-10", onPress }: CloseEndButtonProps) {
  const { iconSize, iconColor } = useThemeStyles(
    theme => ({
      iconColor: theme.palette[color],
      iconSize: theme.iconDimensions.link,
    }),
    [color]
  );

  return (
    <Pressable onPress={onPress} style={{ transform: [{ scaleX: !I18nManager.isRTL ? 1 : -1 }] }}>
      <CloseIcon height={iconSize} width={iconSize} color={iconColor} />
    </Pressable>
  );
}
