import { I18nManager, Pressable, StyleSheet, ViewStyle } from "react-native";

import { DeleteIcon } from "@/assets/icons";
import { Theme, useThemeStyles } from "@/theme";

export interface DeleteEndButtonProps {
  color?: keyof Theme["palette"];
  onPress: () => void;
  hasBackground?: boolean;
  testID?: string;
}

export default function DeleteEndButton({
  color = "primaryBase-10",
  onPress,
  hasBackground,
  testID,
}: DeleteEndButtonProps) {
  const { iconColor } = useThemeStyles(
    theme => ({
      iconColor: theme.palette[color],
    }),
    [color]
  );

  const iconBackgroundStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60-60%"],
    width: theme.spacing["32p"],
    height: theme.spacing["32p"],
    borderRadius: theme.radii.medium,
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
      <DeleteIcon color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
