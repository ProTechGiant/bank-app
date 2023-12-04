import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Circle, G } from "react-native-svg";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface DonutProps {
  percentage?: number;
  radius?: number;
  strokeWidth?: number;
  duration?: number;
  color?: string;
  textColor?: string;
  max?: number;
  text: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function CircularProgress({
  percentage = 100,
  radius = 32,
  strokeWidth = 6.5,
  duration = 0,
  color = "#FF523D",
  max = 100,
  text,
}: DonutProps) {
  const { t } = useTranslation();

  const animatedValue = useSharedValue(0);
  const circumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;

  const animatedProps = useAnimatedProps(() => {
    const maxPercentage = (100 * animatedValue.value) / max;
    const strokeDashoffset = circumference - (circumference * maxPercentage) / 100;
    return {
      strokeDashoffset,
    };
  });

  useEffect(() => {
    // Calculate the remaining time for the animation
    const remainingTime = (duration * percentage) / max;

    animatedValue.value = withTiming(percentage, {
      duration: remainingTime,
      easing: Easing.linear,
    });
  }, [animatedValue, max, percentage, duration]);

  const textContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "center",
    alignItems: "center",
    top: theme.spacing["8p"],
  }));

  return (
    <View style={styles.container}>
      <Svg height={radius * 2} width={radius * 2} viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          <AnimatedCircle
            animatedProps={animatedProps}
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDashoffset={circumference}
            strokeDasharray={circumference}
          />
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke="#78758A"
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeOpacity=".1"
          />
        </G>
      </Svg>
      <View style={[StyleSheet.absoluteFillObject, textContainerStyle]}>
        <Typography.Text weight="medium" size="footnote" color="neutralBase+30">
          {text}
        </Typography.Text>

        <Typography.Text weight="regular" size="caption2" color="neutralBase">
          {t("HelpAndSupport.LiveChatScreen.agentTimer.minute")}
        </Typography.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    width: 64,
  },
});
