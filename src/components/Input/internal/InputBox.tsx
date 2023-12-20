import React, { useEffect, useState } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { OutlinedCancelIcon, OutlinedErrorCircle } from "@/assets/icons";
import { useTheme, useThemeStyles } from "@/theme";

interface InputBoxProps {
  addonStart?: React.ReactNode;
  children: React.ReactNode;
  isError?: boolean;
  isFocused: boolean;
  numberOfLines?: number;
  value?: string | number;
  onClear?: () => void;
  testID?: string;
  isDropdown?: boolean;
  onCrossClear?: () => void | undefined;
  isEditable?: boolean;
}

export default function InputBox({
  addonStart,
  children,
  isError,
  isFocused,
  numberOfLines = 1,
  value,
  onClear,
  testID,
  isDropdown = false,
  isEditable = true,
  onCrossClear,
}: InputBoxProps) {
  const { theme } = useTheme();
  const [isClearButtonVisible, setIsClearButtonVisible] = useState(true);

  useEffect(() => {
    if (value !== undefined && !isDropdown && isEditable) setIsClearButtonVisible(true);
    if (!isFocused)
      setTimeout(() => {
        setIsClearButtonVisible(false);
      }, 500);
  }, [value, isFocused]);

  const containerStyle = useThemeStyles<ViewStyle>(
    t => ({
      borderRadius: t.radii.regular,
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
      flexShrink: 1,
    }),
    [addonStart]
  );

  const iconStyle = useThemeStyles<ViewStyle>(t => ({
    alignItems: "center",
    justifyContent: "center",
    paddingStart: t.spacing["12p"],
    paddingEnd: t.spacing["12p"],
  }));

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: isError ? theme.palette["neutralBase-60"] : theme.palette["neutralBase-40"],
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
          <OutlinedErrorCircle color={theme.palette.errorBase} />
        </View>
      ) : null}

      {value !== undefined && !isDropdown && isEditable && isClearButtonVisible ? (
        (typeof value === "string" && value.length > 0) || (typeof value === "number" && value > 0) ? (
          <Pressable
            style={iconStyle}
            onPress={() => {
              onClear && onClear();
              if (onCrossClear) onCrossClear;
            }}
            testID={testID !== undefined ? `${testID}-ClearButton` : undefined}>
            <OutlinedCancelIcon />
          </Pressable>
        ) : null
      ) : null}
    </Animated.View>
  );
}
