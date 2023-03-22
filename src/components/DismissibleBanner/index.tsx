import { cloneElement, useEffect } from "react";
import { Platform, StyleSheet, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { SvgProps } from "react-native-svg";

import { TickCircleIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { generateShadow, useThemeStyles } from "@/theme";

interface DismissibleBannerProps {
  onClearPress?: () => void;
  icon?: React.ReactElement<SvgProps>;
  message: string;
  visible: boolean;
  variant?: "default" | "success" | "error";
  testID?: string;
}

export default function DismissibleBanner({
  icon = <TickCircleIcon />,
  visible,
  variant = "default",
  message,
  testID,
}: DismissibleBannerProps) {
  const positionY = useSharedValue(-100);
  const offset_ = useThemeStyles(theme => theme.spacing["24p"]);
  const visiblePosY = Platform.OS !== "android" ? offset_ : 0;

  useEffect(() => {
    positionY.value = visible ? visiblePosY : -250;
  }, [visible]);

  const containerStyles = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor:
        variant === "error"
          ? theme.palette.errorBase
          : variant === "success"
          ? theme.palette.successBase
          : theme.palette.primaryBase,
      borderRadius: theme.radii.extraSmall,
      alignItems: "flex-start",
      flexDirection: "row",
      left: 0,
      columnGap: theme.spacing["16p"],
      margin: theme.spacing["20p"],
      padding: theme.spacing["16p"],
      position: "absolute",
      right: 0,
      zIndex: 100,
    }),
    [variant]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(positionY.value) }],
  }));

  const iconColor = useThemeStyles(theme => theme.palette["neutralBase-60"]);

  return (
    <Animated.View style={[containerStyles, styles.shadow, animatedStyle]} testID={testID}>
      {cloneElement(icon, { ...styles.icon, color: iconColor })}
      <Typography.Text color="neutralBase-60" weight="regular" size="callout" style={styles.text}>
        {message}
      </Typography.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  icon: {
    height: 20,
    width: 20,
  },
  shadow: generateShadow(4),
  text: {
    flex: 1,
    flexWrap: "wrap",
  },
});
