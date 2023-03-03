import { cloneElement, useEffect } from "react";
import { Platform, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { SvgProps } from "react-native-svg";

import { TickCircleIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface DismissibleBannerProps {
  icon?: React.ReactElement<SvgProps>;
  message: string;
  visible: boolean;
  isError?: boolean;
  testID?: string;
}

export default function DismissibleBanner({
  icon = <TickCircleIcon />,
  visible,
  isError = false,
  message,
  testID,
}: DismissibleBannerProps) {
  const positionY = useSharedValue(-100);
  const offset_ = useThemeStyles(theme => theme.spacing["20p"]);
  const visiblePosY = Platform.OS !== "android" ? offset_ : 0;

  useEffect(() => {
    positionY.value = visible ? visiblePosY : -100;
  }, [visible]);

  const containerStyles = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: isError ? theme.palette.errorBase : theme.palette.primaryBase,
      borderRadius: theme.radii.extraSmall,
      alignItems: "center",
      flexDirection: "row",
      elevation: 4,
      height: 56,
      left: 0,
      margin: theme.spacing["20p"],
      padding: theme.spacing["16p"],
      position: "absolute",
      right: 0,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      zIndex: 100,
    }),
    [isError]
  );

  const textStyle = useThemeStyles<ViewStyle>(theme => ({
    marginLeft: theme.spacing["16p"],
  }));

  const iconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.tick);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(positionY.value) }],
  }));

  return (
    <Animated.View style={[containerStyles, animatedStyle]} testID={testID}>
      {cloneElement(icon, { height: iconDimensions, width: iconDimensions })}
      <Typography.Text color="neutralBase-50" weight="regular" size="callout" style={textStyle}>
        {message}
      </Typography.Text>
    </Animated.View>
  );
}
