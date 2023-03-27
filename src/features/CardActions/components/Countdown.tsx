import { Pressable, StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface CountdownProps {
  startInSeconds: number;
  text: string;
  onPress: () => void;
  value: number;
}

const CIRCLE_SIZE = 18;
const STROKE_WIDTH = 2;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUM = RADIUS * 2 * Math.PI;

export default function Countdown({ startInSeconds, text, onPress, value }: CountdownProps) {
  const progress = value / startInSeconds;
  const strokeWidth = STROKE_WIDTH;

  const isActive = value >= startInSeconds;
  const strokeBackgroundColor = useThemeStyles<string>(theme => theme.palette["neutralBase-30"]);
  const strokeProgressColor = useThemeStyles<string>(theme => theme.palette.neutralBase);

  return (
    <View style={styles.container}>
      {!isActive && (
        <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
          <Circle
            stroke={strokeBackgroundColor}
            fill="none"
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            strokeWidth={strokeWidth}
          />
          {progress < 0.99 && (
            <Circle
              stroke={strokeProgressColor}
              fill="none"
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={RADIUS}
              strokeDasharray={`${CIRCUM} ${CIRCUM}`}
              strokeDashoffset={RADIUS * Math.PI * 2 * (1 - progress)}
              strokeLinecap="round"
              transform={`rotate(-90, ${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2})`}
              strokeWidth={strokeWidth}
            />
          )}
        </Svg>
      )}
      <Pressable disabled={!isActive} onPress={onPress}>
        <Typography.Text size="callout" color={isActive ? "primaryBase" : "neutralBase"} style={styles.link}>
          {text}
        </Typography.Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  link: {
    marginHorizontal: 12,
  },
});
