import { cloneElement, useEffect } from "react";
import { Platform, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { SvgProps } from "react-native-svg";

import { TickCircleIcon } from "@/assets/icons";
import { WithShadow } from "@/components";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

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
  }, [positionY, visible, visiblePosY]);

  const contentContainerStyles = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.extraSmall,
    alignItems: "flex-start",
    flexDirection: "row",
    columnGap: theme.spacing["16p"],
    padding: theme.spacing["16p"],
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

  const iconColor = useThemeStyles(theme => theme.palette["neutralBase-60"]);
  const backgroundColor = variant === "error" ? "errorBase" : variant === "success" ? "successBase" : "primaryBase";

  return (
    <Animated.View style={[animationContainerStyles, animatedStyle]} testID={testID}>
      <WithShadow backgroundColor={backgroundColor} borderRadius="extraSmall">
        <View style={contentContainerStyles}>
          {cloneElement(icon, { ...styles.icon, color: iconColor })}
          <Typography.Text color="neutralBase-60" weight="regular" size="callout" style={styles.text}>
            {message}
          </Typography.Text>
        </View>
      </WithShadow>
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
