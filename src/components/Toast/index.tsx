import { cloneElement, useEffect } from "react";
import { Platform, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { SvgProps } from "react-native-svg";

import { ErrorFilledCircleIcon, TickCircleIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface ToastProps {
  icon?: React.ReactElement<SvgProps>;
  message: string;
  isVisible: boolean;
  variant: "confirm" | "warning" | "negative";
  testID?: string;
}

const VARIANT_ICONS = {
  confirm: <TickCircleIcon />,
  warning: <ErrorFilledCircleIcon />,
  negative: <ErrorFilledCircleIcon />,
};

// @see https://www.figma.com/file/tl0ZMqLtY3o72AtiWUSgmc/Brand-Design-System?type=design&node-id=1503-8659&t=ixyhoCSGO91Uokxq-0
export default function Toast({ icon, isVisible, variant = "confirm", message, testID }: ToastProps) {
  const positionY = useSharedValue(-250);
  const offset_ = useThemeStyles(theme => theme.spacing["24p"]);
  const visiblePosY = Platform.OS !== "android" ? offset_ : 0;

  useEffect(() => {
    positionY.value = isVisible ? visiblePosY : -250;
  }, [positionY, isVisible, visiblePosY]);

  const contentContainerStyles = useThemeStyles<ViewStyle>(theme => ({
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 32,
    elevation: 5,
    backgroundColor: theme.palette["neutralBase-60"],
    borderRadius: theme.radii.medium,
    borderColor: theme.palette["neutralBase-30"],
    borderWidth: 0.5,
    alignItems: "flex-start",
    flexDirection: "row",
    columnGap: theme.spacing["16p"],
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  const animationContainerStyles = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    right: 0,
    zIndex: 100,
    left: 0,
    margin: theme.spacing["20p"],
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(positionY.value) }],
  }));

  const iconColor = useThemeStyles(
    ({ palette }) =>
      variant === "confirm"
        ? palette["primaryBase-40"]
        : variant === "warning"
        ? palette.warningBase
        : palette["errorBase-10"],
    [variant]
  );

  return (
    <Animated.View style={[animationContainerStyles, animatedStyle]} testID={testID}>
      <View style={contentContainerStyles}>
        {icon !== undefined
          ? cloneElement(icon, { ...styles.icon })
          : cloneElement(VARIANT_ICONS[variant], { ...styles.icon, color: iconColor })}

        <Typography.Text color="neutralBase+30" weight="regular" size="footnote" style={styles.text}>
          {message}
        </Typography.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  icon: {
    height: 20,
    width: 20,
  },
  text: {
    flex: 1,
    flexWrap: "wrap",
  },
});
