import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { CheckIcon, CheckIconBig } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { palette, typography } from "@/theme/values";

interface ProgressWheelProps {
  current: number;
  total: number;
  circleSize: number;
  textColor?: keyof typeof palette;
  textSize?: keyof typeof typography.text.sizes;
  bigCheckIcon?: boolean;
}

export default function ProgressWheel({
  current,
  total,
  circleSize,
  textColor,
  textSize,
  bigCheckIcon,
}: ProgressWheelProps) {
  const strokeBackgroundColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);
  const strokeProgressColor = useThemeStyles<string>(theme => theme.palette.primaryBase);

  const checkIconStyle = useThemeStyles(theme => ({
    color: theme.palette["neutralBase+30"],
  }));

  const STROKE_WIDTH = 6;
  const RADIUS = (circleSize - STROKE_WIDTH) / 2;
  const CIRCUM = RADIUS * 2 * Math.PI;
  const progressPercentage = (current / total) * 100;

  // this is needed to fill the progress wheel when the goal balance its more than the goal target

  const progress = Math.max(100 - progressPercentage, 0);

  const strokeWidth = STROKE_WIDTH;

  return (
    <View style={styles.container}>
      <Svg width={circleSize} height={circleSize}>
        <Circle
          opacity={0.08}
          stroke={strokeBackgroundColor}
          fill="none"
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={RADIUS}
          strokeWidth={strokeWidth}
        />
        {progressPercentage !== 0 && (
          <Circle
            stroke={strokeProgressColor}
            fill="none"
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={RADIUS}
            strokeDasharray={`${CIRCUM} ${CIRCUM}`}
            strokeDashoffset={RADIUS * Math.PI * 2 * (progress / 100)}
            strokeLinecap="square"
            transform={`rotate(-90, ${circleSize / 2}, ${circleSize / 2})`}
            strokeWidth={strokeWidth}
          />
        )}
      </Svg>
      <View style={styles.innerContainer}>
        {progressPercentage >= 100 ? (
          bigCheckIcon ? (
            <CheckIconBig color={checkIconStyle.color} />
          ) : (
            <CheckIcon color={checkIconStyle.color} />
          )
        ) : (
          <Typography.Text align="center" weight="medium" size={textSize} color={textColor}>
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
