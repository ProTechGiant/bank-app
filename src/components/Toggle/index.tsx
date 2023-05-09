import { I18nManager, Pressable, StyleSheet, ViewStyle } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle, withTiming } from "react-native-reanimated";

import { useThemeStyles } from "@/theme";

interface ToggleProps {
  onPress: () => void;
  testID?: string;
  value: boolean;
  disabled?: boolean;
}

export default function Toggle({ onPress, testID, disabled, value }: ToggleProps) {
  const disabledOffColor = useThemeStyles(theme => theme.palette["neutralBase-40"]);
  const offColor = useThemeStyles(theme => theme.palette["neutralBase-30"]);
  const onColor = useThemeStyles(theme => theme.palette.complimentBase);

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0, 0, 0, 0.04)",
    borderRadius: BUTTON_SIZE / 2,
    height: BUTTON_SIZE,
    width: BUTTON_SIZE,
  }));

  const containerStyle = useThemeStyles<ViewStyle>(() => ({
    borderRadius: BUTTON_SIZE,
    padding: 2,
    width: BUTTON_SIZE * 2,
  }));

  const backgroundAnimatedStyle = useAnimatedStyle(
    () => ({
      backgroundColor: disabled
        ? disabledOffColor
        : interpolateColor(value === true ? 1 : 0, [0, 1], [offColor, onColor]),
    }),
    [disabled, value]
  );

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const toValue = value === false ? 0 : I18nManager.isRTL ? -BUTTON_SIZE + 4 : +BUTTON_SIZE - 4;

    return { transform: [{ translateX: withTiming(toValue, { duration: 200 }) }] };
  }, [value]);

  return (
    <Pressable disabled={disabled} onPress={onPress} testID={testID}>
      <Animated.View style={[containerStyle, backgroundAnimatedStyle]}>
        <Animated.View style={[buttonStyle, buttonAnimatedStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const BUTTON_SIZE = 24;
