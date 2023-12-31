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
  const baseLabelSize = useThemeStyles(theme => theme.typography.text.sizes.footnote);

  const labelStyle = useThemeStyles<TextStyle>(
    theme => ({
      color: theme.palette["neutralBase+10"],
      fontSize: theme.typography.text.sizes.callout,
      fontWeight: theme.typography.text.weights.regular,
      position: "absolute",
      top: theme.spacing["16p"],
      left: theme.spacing["16p"],
    }),
    [isEditable]
  );

  const animatedLabelStyle = useAnimatedStyle(() => {
    const configuration: WithTimingConfig = { duration: 200 };

    return {
      fontSize: withTiming(baseLabelSize, configuration),
      transform: [{ translateY: withTiming(-8, configuration) }],
    };
  }, [isFocused, containsValue]);

  return <Animated.Text style={[labelStyle, animatedLabelStyle]}>{label}</Animated.Text>;
}
