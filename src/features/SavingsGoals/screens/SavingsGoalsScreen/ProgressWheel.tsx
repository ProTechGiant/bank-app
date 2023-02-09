import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { CheckIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface ProgressWheelProps {
  current: number;
  total: number;
}

const CIRCLE_SIZE = 64;
const STROKE_WIDTH = 6;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUM = RADIUS * 2 * Math.PI;

export default function ProgressWheel({ current, total }: ProgressWheelProps) {
  const strokeBackgroundColor = useThemeStyles<string>(theme => theme.palette["neutralBase-30"], []);
  const strokeProgressColor = useThemeStyles<string>(theme => theme.palette.complimentBase, []);

  const progressPercentage = (current / total) * 100;
  const progress = 100 - progressPercentage;
  const strokeWidth = STROKE_WIDTH;

  return (
    <View style={styles.container}>
      <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
        <Circle
          stroke={strokeBackgroundColor}
          fill="none"
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={RADIUS}
          {...{ strokeWidth }}
        />
        <Circle
          stroke={strokeProgressColor}
          fill="none"
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={RADIUS}
          strokeDasharray={`${CIRCUM} ${CIRCUM}`}
          strokeDashoffset={RADIUS * Math.PI * 2 * (progress / 100)}
          strokeLinecap="round"
          transform={`rotate(-90, ${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2})`}
          {...{ strokeWidth }}
        />
      </Svg>
      <View style={styles.innerContainer}>
        {progressPercentage === 100 ? (
          <CheckIcon />
        ) : (
          <Typography.Text weight="medium" size="footnote">
            {progressPercentage.toFixed(0)}%
          </Typography.Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    position: "absolute",
  },
});
