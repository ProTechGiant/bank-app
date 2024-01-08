import { cloneElement } from "react";
import { I18nManager, Pressable, StyleSheet, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg/lib/typescript/ReactNativeSVG";

import { IconProps } from "@/assets/icons";
import { Theme, useThemeStyles } from "@/theme";

export interface IconEndButtonProps {
  color?: keyof Theme["palette"];
  onPress: () => void;
  icon: React.ReactElement<SvgProps | IconProps>;
  hasBackground?: boolean;
  testID?: string;
}

export default function IconEndButton({
  color = "neutralBase-60",
  onPress,
  icon,
  hasBackground,
  testID,
}: IconEndButtonProps) {
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
      testID={testID !== undefined ? `${testID}-IconButton` : undefined}>
      {cloneElement(icon, {
        height: 18,
        width: 18,
        color: iconColor,
      })}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
