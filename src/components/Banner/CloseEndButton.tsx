import { I18nManager, Pressable } from "react-native";

import { CloseIcon } from "@/assets/icons";
import { Theme, useThemeStyles } from "@/theme";

export interface CloseEndButtonProps {
  color?: keyof Theme["palette"];
  testID?: string;
  onPress: () => void;
}

export default function CloseEndButton({ color = "primaryBase-10", testID, onPress }: CloseEndButtonProps) {
  const { iconColor } = useThemeStyles(
    theme => ({
      iconColor: theme.palette[color],
    }),
    [color]
  );
  const iconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.accordian, []);

  return (
    <Pressable onPress={onPress} style={{ transform: [{ scaleX: !I18nManager.isRTL ? 1 : -1 }] }} testID={testID}>
      <CloseIcon color={iconColor} width={iconDimensions} height={iconDimensions} />
    </Pressable>
  );
}
