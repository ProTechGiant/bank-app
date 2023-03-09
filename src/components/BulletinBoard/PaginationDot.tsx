import { StyleSheet } from "react-native";
import Animated, { interpolate, interpolateColor, useAnimatedStyle } from "react-native-reanimated";

import { useThemeStyles } from "@/theme";

interface PaginationDotProps {
  index: number;
  scrollX: Animated.SharedValue<number>;
  width: number;
}

export default function PaginationDot({ index, scrollX, width }: PaginationDotProps) {
  const paginatorDotActiveColor = useThemeStyles(theme => theme.palette.complimentBase);
  const paginatorDotInactiveColor = useThemeStyles(theme => theme.palette["primaryBase-30"]);

  const animatedStyle = useAnimatedStyle(() => ({
    // interpolate the dot color between inactive & active
    backgroundColor: interpolateColor(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [paginatorDotInactiveColor, paginatorDotActiveColor, paginatorDotInactiveColor]
    ),
    transform: [
      {
        scale: interpolate(
          scrollX.value,
          [(index - 1) * width, index * width, (index + 1) * width],
          [1, ACTIVE_DOT_SIZE / INACTIVE_DOT_SIZE, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        ),
      },
    ],
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const ACTIVE_DOT_SIZE = 8;
const INACTIVE_DOT_SIZE = 6;

const styles = StyleSheet.create({
  dot: {
    borderRadius: INACTIVE_DOT_SIZE / 2,
    height: INACTIVE_DOT_SIZE,
    width: INACTIVE_DOT_SIZE,
  },
});
