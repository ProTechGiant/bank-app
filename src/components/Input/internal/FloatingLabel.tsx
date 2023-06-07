import { TextStyle } from "react-native/types";
import Animated, { useAnimatedStyle, withTiming, WithTimingConfig } from "react-native-reanimated";

import { useThemeStyles } from "@/theme";

interface FloatingLabelProps {
  containsValue: boolean;
  isEditable: boolean;
  isFocused: boolean;
  label: string;
}

export default function FloatingLabel({ containsValue, isEditable, isFocused, label }: FloatingLabelProps) {
  const floatingLabelSize = useThemeStyles(theme => theme.typography.text.sizes.caption2);
  const baseLabelSize = useThemeStyles(theme => theme.typography.text.sizes.callout);

  const labelStyle = useThemeStyles<TextStyle>(
    theme => ({
      color: isEditable ? theme.palette["neutralBase-10"] : theme.palette["neutralBase-20"],
      fontSize: theme.typography.text.sizes.callout,
      fontWeight: theme.typography.text.weights.regular,
      position: "absolute",
      top: theme.spacing["18p"],
      left: theme.spacing["16p"],
    }),
    [isEditable]
  );

  const animatedLabelStyle = useAnimatedStyle(() => {
    const floating = isFocused || containsValue;
    const configuration: WithTimingConfig = { duration: 200 };

    return {
      fontSize: withTiming(floating ? floatingLabelSize : baseLabelSize, configuration),
      transform: [{ translateY: withTiming(floating ? -8 : 0, configuration) }],
    };
  }, [isFocused, containsValue]);

  return <Animated.Text style={[labelStyle, animatedLabelStyle]}>{label}</Animated.Text>;
}
