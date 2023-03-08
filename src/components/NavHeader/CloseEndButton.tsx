import { I18nManager, Pressable } from "react-native";

import { CloseIcon } from "@/assets/icons";
import { Theme, useThemeStyles } from "@/theme";

export interface CloseEndButtonProps {
  color?: keyof Theme["palette"];
  onPress: () => void;
}

export default function CloseEndButton({ color = "primaryBase-10", onPress }: CloseEndButtonProps) {
  const { iconColor } = useThemeStyles(
    theme => ({
      iconColor: theme.palette[color],
    }),
    [color]
  );

  return (
    <Pressable onPress={onPress} style={{ transform: [{ scaleX: !I18nManager.isRTL ? 1 : -1 }] }}>
      <CloseIcon color={iconColor} />
    </Pressable>
  );
}
