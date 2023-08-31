import { I18nManager, Pressable, StyleSheet, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import { Theme, useThemeStyles } from "@/theme";

export interface CloseEndButtonProps {
  color?: keyof Theme["palette"];
  onPress: () => void;
  hasBackground?: boolean;
  testID?: string;
}

export default function CloseEndButton({
  color = "primaryBase-10",
  onPress,
  hasBackground,
  testID,
}: CloseEndButtonProps) {
  const { iconColor } = useThemeStyles(
    theme => ({
      iconColor: theme.palette[color],
    }),
    [color]
  );

  const iconBackgroundStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60-60%"],
    width: 32,
    height: 32,
    borderRadius: 16,
  }));

  return (
    <Pressable
      onPress={onPress}
      style={[
        { transform: [{ scaleX: !I18nManager.isRTL ? 1 : -1 }] },
        styles.container,
        hasBackground === true ? iconBackgroundStyle : undefined,
      ]}
      testID={testID !== undefined ? `${testID}-CloseButton` : undefined}>
      <CloseIcon color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
