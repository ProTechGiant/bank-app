import { I18nManager, Pressable } from "react-native";

import { AngleDownIcon, AngleUpIcon } from "@/assets/icons";
import { Theme, useThemeStyles } from "@/theme";

export interface ExpandEndButtonProps {
  color?: keyof Theme["palette"];
  testID?: string;
  onPress: () => void;
  expanded: boolean;
}

export default function ExpandEndButton({ color = "primaryBase-10", testID, onPress, expanded }: ExpandEndButtonProps) {
  const { iconColor } = useThemeStyles(
    theme => ({
      iconColor: theme.palette[color],
    }),
    [color]
  );

  return (
    <Pressable onPress={onPress} style={{ transform: [{ scaleX: !I18nManager.isRTL ? 1 : -1 }] }} testID={testID}>
      {expanded ? (
        <AngleUpIcon color={iconColor} width={24} height={24} />
      ) : (
        <AngleDownIcon color={iconColor} width={24} height={24} />
      )}
    </Pressable>
  );
}
