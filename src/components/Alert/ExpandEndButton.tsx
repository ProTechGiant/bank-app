import { I18nManager, Pressable } from "react-native";

import { AngleDownIcon, AngleUpIcon } from "@/assets/icons";
import { useThemeStyles } from "@/theme";

export interface ExpandEndButtonProps {
  testID?: string;
  onPress: () => void;
  expanded: boolean;
}

export default function ExpandEndButton({ testID, onPress, expanded }: ExpandEndButtonProps) {
  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  return (
    <Pressable onPress={onPress} style={{ transform: [{ scaleX: !I18nManager.isRTL ? 1 : -1 }] }} testID={testID}>
      {expanded ? (
        <AngleUpIcon color={iconColor} width={20} height={20} />
      ) : (
        <AngleDownIcon color={iconColor} width={20} height={20} />
      )}
    </Pressable>
  );
}
