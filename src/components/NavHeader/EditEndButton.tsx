import { I18nManager, Pressable } from "react-native";

import { EditIcon } from "@/assets/icons";
import { Theme, useThemeStyles } from "@/theme";

export interface EditEndButtonProps {
  color?: keyof Theme["palette"];
  onPress: () => void;
}

export default function EditEndButton({ color = "primaryBase-10", onPress }: EditEndButtonProps) {
  const { iconColor } = useThemeStyles(
    theme => ({
      iconColor: theme.palette[color],
    }),
    [color]
  );

  return (
    <Pressable onPress={onPress} style={{ transform: [{ scaleX: !I18nManager.isRTL ? 1 : -1 }] }}>
      <EditIcon color={iconColor} />
    </Pressable>
  );
}
