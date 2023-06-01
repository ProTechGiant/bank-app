import { I18nManager, Pressable } from "react-native";

import { CloseIcon } from "@/assets/icons";
import { useThemeStyles } from "@/theme";

export interface CloseEndButtonProps {
  testID?: string;
  onPress: () => void;
}

export default function CloseEndButton({ testID, onPress }: CloseEndButtonProps) {
  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  return (
    <Pressable onPress={onPress} style={{ transform: [{ scaleX: !I18nManager.isRTL ? 1 : -1 }] }} testID={testID}>
      <CloseIcon color={iconColor} width={20} height={20} />
    </Pressable>
  );
}
