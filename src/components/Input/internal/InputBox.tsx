import React from "react";
import { View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { ErrorFilledCircleIcon } from "@/assets/icons";
import { useTheme, useThemeStyles } from "@/theme";

interface InputBoxProps {
  addonStart?: React.ReactNode;
  children: React.ReactNode;
  isError?: boolean;
  isFocused: boolean;
  numberOfLines?: number;
}

export default function InputBox({ addonStart, children, isError, isFocused, numberOfLines = 1 }: InputBoxProps) {
  const { theme } = useTheme();

  const containerStyle = useThemeStyles<ViewStyle>(
    t => ({
      borderRadius: t.radii.small,
      borderWidth: 2,
      minHeight: Math.max(58, 58 + (numberOfLines - 1) * theme.typography.text._lineHeights.callout),
      flexDirection: "row",
      flexShrink: 1,
    }),
    [numberOfLines]
  );

  const contentStyle = useThemeStyles<ViewStyle>(
    t => ({
      flexGrow: 1,
      paddingEnd: !isError ? t.spacing["16p"] : undefined,
      paddingStart: addonStart === undefined ? t.spacing["16p"] : undefined,
      paddingVertical: t.spacing["12p"],
    }),
    [addonStart]
  );

  const iconStyle = useThemeStyles<ViewStyle>(t => ({
    alignItems: "center",
    paddingTop: t.spacing["16p"],
    width: 40,
  }));

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: isError ? theme.palette["errorBase-30"] : theme.palette["neutralBase-40"],
      borderColor: isError
        ? theme.palette.errorBase
        : isFocused
        ? theme.palette.primaryBase
        : theme.palette["neutralBase-40"],
    };
  }, [isError, isFocused]);

  return (
    <Animated.View style={[containerStyle, animatedContainerStyle]}>
      {addonStart !== undefined ? <View style={iconStyle}>{addonStart}</View> : null}
      <View style={contentStyle}>{children}</View>
      {isError ? (
        <View style={iconStyle}>
          <ErrorFilledCircleIcon color={theme.palette.errorBase} />
        </View>
      ) : null}
    </Animated.View>
  );
}
