import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface CountdownLinkProps {
  restart: boolean;
  timeInSecond: number;
  link: string;
  onPress: () => void;
}

const CIRCLE_SIZE = 18;
const STROKE_WIDTH = 2;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUM = RADIUS * 2 * Math.PI;

export default function CountdownLink({ restart, timeInSecond, link, onPress }: CountdownLinkProps) {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const progressPercentage = (count / timeInSecond) * 100;
  const progress = 100 - progressPercentage;
  const strokeWidth = STROKE_WIDTH;

  useEffect(() => {
    if (restart) {
      const timer = setInterval(() => {
        if (count < timeInSecond) {
          setCount(count + 1);
        } else {
          setIsActive(true);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
    return;
  }, [restart, count]);

  const handleOnPress = () => {
    onPress();
    setCount(0);
    setIsActive(false);
  };

  const strokeBackgroundColor = useThemeStyles<string>(theme => theme.palette["neutralBase-30"], []);

  const strokeProgressColor = useThemeStyles<string>(theme => theme.palette["neutralBase"], []);

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
          {progressPercentage !== 0 && (
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
              strokeWidth={strokeWidth}
            />
          )}
        </Svg>
      )}
      <Pressable disabled={!isActive} onPress={handleOnPress}>
        <Typography.Text size="callout" color={isActive ? "primaryBase" : "neutralBase"} style={styles.link}>
          {link}
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
  link: { marginHorizontal: 12 },
});
