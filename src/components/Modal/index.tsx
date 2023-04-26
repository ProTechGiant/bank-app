import { useEffect, useState } from "react";
import {
  Modal as RNModal,
  ModalProps as RNModalProps,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CloseIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface ModalProps extends Omit<RNModalProps, "animationType" | "onRequestClose" | "transparent"> {
  onClose?: () => void;
  headerText?: string;
  style?: ViewStyle;
}

const NativeModal = Platform.OS === "web" ? View : RNModal;
export default function Modal({
  children,
  onClose,
  headerText,
  visible = false,
  style,
  ...nativeModalProps
}: ModalProps) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const contentHeight = useSharedValue<number | undefined>(height);
  const transitionPhase = useSharedValue(visible ? 1 : 0);
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    if (isVisible === visible) return;

    if (visible) {
      setIsVisible(true);
    }

    if (!visible) {
      handleStartTransitioning();
      setTimeout(() => setIsVisible(false), MOVE_OUT_DURATION_MS + 25);
    }
  }, [visible]);

  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    borderTopLeftRadius: theme.radii.small * 1.5,
    borderTopRightRadius: theme.radii.small * 1.5,
    marginTop: "auto",
  }));

  const contentStyles = useThemeStyles<ViewStyle>(
    theme => {
      const hasOverridenBottomPadding =
        undefined !== style?.paddingBottom ||
        undefined !== style?.marginBottom ||
        undefined !== style?.paddingVertical ||
        undefined !== style?.marginVertical;

      return {
        padding: theme.spacing["16p"],
        paddingBottom: !hasOverridenBottomPadding ? insets.bottom : undefined,
      };
    },
    [insets.bottom, style]
  );

  const headerStyles = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    // padding around entire modal - additional padding of current element
    marginBottom: theme.spacing["16p"] - theme.spacing["4p"],
    padding: theme.spacing["4p"],
  }));

  const containerAnimatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(transitionPhase.value, [0, 1], [contentHeight.value ?? 0, 0]),
      },
    ],
  }));

  const backdropAnimatedStyles = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(transitionPhase.value, [0, 1], ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.6)"]),
  }));

  const handleStartTransitioning = () => {
    transitionPhase.value = withTiming(visible ? 1 : 0, {
      easing: Easing.bezier(0.42, 0, 0.58, 1),
      duration: visible ? MOVE_IN_DURATION_MS : MOVE_OUT_DURATION_MS,
    });
  };

  return (
    <NativeModal onRequestClose={onClose} transparent visible={isVisible} {...nativeModalProps}>
      <Animated.View onTouchStart={() => onClose?.()} style={[styles.backdrop, backdropAnimatedStyles]} />
      <Animated.View
        onLayout={event => {
          contentHeight.value = event.nativeEvent.layout.height;
          if (visible) handleStartTransitioning();
        }}
        style={[containerStyles, containerAnimatedStyles, style]}>
        <View style={contentStyles}>
          {(undefined !== headerText || undefined !== onClose) && (
            <View style={headerStyles}>
              <View />
              <View style={styles.headerTextContainer}>
                <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                  {headerText}
                </Typography.Text>
              </View>
              <View>
                {undefined !== onClose && (
                  <Pressable hitSlop={HIT_SLOP_RIGHT} onPress={onClose}>
                    <CloseIcon />
                  </Pressable>
                )}
              </View>
            </View>
          )}
          {children}
        </View>
      </Animated.View>
    </NativeModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  headerTextContainer: {
    alignItems: "center",
    flexShrink: 1,
  },
});

const HIT_SLOP_RIGHT = { top: 10, bottom: 10, left: 0, right: 10 };
const MOVE_IN_DURATION_MS = 300;
const MOVE_OUT_DURATION_MS = 150;
