import { I18nManager, Pressable, ViewStyle } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle } from "react-native-reanimated";

import { useThemeStyles } from "@/theme";

interface ToggleProps {
  onPress: () => void;
  testID?: string;
  value: boolean;
  disabled?: boolean;
}

export default function Toggle({ onPress, testID, disabled, value }: ToggleProps) {
  const disabledOffColor = useThemeStyles<string>(theme => theme.palette["neutralBase-40"]);
  const offColor = useThemeStyles<string>(theme => theme.palette["neutralBase-30"]);
  const onColor = useThemeStyles<string>(theme => theme.palette.complimentBase);

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: BUTTON_SIZE / 2,
    height: BUTTON_SIZE,
    width: BUTTON_SIZE,
    backgroundColor: theme.palette["neutralBase-60"],
    borderWidth: 0.5,
    borderColor: "#0000000D",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 1,
  }));

  const containerStyle = useThemeStyles<ViewStyle>(() => ({
    borderRadius: BUTTON_SIZE,
    paddingHorizontal: 2,
    paddingVertical: 2,
    width: 44,
  }));

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(value ? 1 : 0, [0, 1], [disabled ? disabledOffColor : offColor, onColor]),
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: value ? (I18nManager.isRTL ? -BUTTON_SIZE : BUTTON_SIZE) : 0,
      },
    ],
  }));

  return (
    <Pressable disabled={disabled} onPress={() => onPress()} testID={testID}>
      <Animated.View style={[containerStyle, backgroundAnimatedStyle]}>
        <Animated.View style={[buttonStyle, buttonAnimatedStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const BUTTON_SIZE = 20;
