import { Platform, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { TickCircleIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface ToastProps {
  showToast: boolean;
  message?: string;
}
export default function Toast({ showToast, message }: ToastProps) {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette.tintBase,
      borderRadius: theme.radii.extraSmall,
      alignItems: "center",
      flexDirection: "row",
      elevation: 4,
      height: 56,
      left: 0,
      margin: theme.spacing.regular,
      padding: theme.spacing.medium,
      position: "absolute",
      right: 0,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      zIndex: 100,
    }),
    []
  );
  const iconStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginRight: theme.spacing.medium,
    }),
    []
  );
  const position = useThemeStyles<number>(theme => (Platform.OS === "ios" ? theme.spacing.regular : 0), []);
  const iconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.tick, []);

  // useSharedValue hook from reanimated library to share values for animation
  const positionY = useSharedValue(-100);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withSpring(positionY.value) }],
    };
  });

  positionY.value = showToast ? position : -position - 100;

  return (
    <Animated.View style={[container, animatedStyle]}>
      <TickCircleIcon height={iconDimensions} width={iconDimensions} style={iconStyle} />
      <Typography.Text color="neutralBase-50" weight="regular" size="callout">
        {message}
      </Typography.Text>
    </Animated.View>
  );
}
