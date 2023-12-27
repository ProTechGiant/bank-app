/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  I18nManager,
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

import { ArrowLeftIcon, CloseIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { Theme, useThemeStyles } from "@/theme";

interface ModalProps extends Omit<RNModalProps, "animationType" | "onRequestClose" | "transparent"> {
  onClose?: () => void;
  closeHasBackground?: boolean;
  onBack?: () => void;
  headerText?: string;
  hasHeaderDivider?: boolean;
  padding?: keyof Theme["spacing"] | 0;
  style?: ViewStyle | ViewStyle[];
}

const NativeModal = Platform.OS === "web" ? View : RNModal;
export default function Modal({
  children,
  onClose,
  closeHasBackground = false,
  onBack,
  headerText,
  hasHeaderDivider = false,
  visible = false,
  padding = "20p",
  style,
  testID,
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
  }, [isVisible, visible]);

  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    borderTopLeftRadius: theme.radii.xlarge,
    borderTopRightRadius: theme.radii.xlarge,
    marginTop: "auto",
  }));

  const contentStyles = useThemeStyles<ViewStyle>(
    theme => {
      const hasOverridenBottomPadding =
        undefined !== style?.paddingBottom ||
        undefined !== style?.marginBottom ||
        undefined !== style?.paddingVertical ||
        undefined !== style?.marginVertical;

      const defaultPaddingBottom = insets.bottom > 0 ? insets.bottom : theme.spacing["16p"];

      return {
        padding: padding !== 0 ? theme.spacing[padding] : undefined,
        paddingBottom: !hasOverridenBottomPadding ? defaultPaddingBottom : undefined,
      };
    },
    [insets.bottom, style]
  );

  const headerStyles = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      // padding around entire modal - additional padding of current element
      marginBottom: theme.spacing["20p"],
      paddingHorizontal: hasHeaderDivider ? theme.spacing["20p"] : theme.spacing["4p"],
      paddingVertical: hasHeaderDivider ? 0 : theme.spacing["4p"],
    }),
    [hasHeaderDivider]
  );

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

  const headerDividerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderBottomColor: theme.palette["neutralBase-30"],
    borderBottomWidth: 1,
    marginHorizontal: -theme.spacing["20p"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette.neutralBase);

  const closeIconStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60-60%"],
    width: theme.spacing["32p"],
    height: theme.spacing["32p"],
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.spacing["16p"],
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
            <View style={[hasHeaderDivider && headerDividerStyle]}>
              <View style={headerStyles}>
                {undefined !== onBack ? (
                  <Pressable onPress={onBack}>
                    <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
                      <ArrowLeftIcon />
                    </View>
                  </Pressable>
                ) : (
                  <View />
                )}
                <View style={styles.headerTextContainer}>
                  <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                    {headerText}
                  </Typography.Text>
                </View>
                <View>
                  {undefined !== onClose && (
                    <Pressable
                      style={closeHasBackground ? closeIconStyle : undefined}
                      hitSlop={HIT_SLOP_RIGHT}
                      onPress={onClose}
                      testID={testID !== undefined ? `${testID}-CloseButton` : undefined}>
                      <CloseIcon color={iconColor} />
                    </Pressable>
                  )}
                </View>
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
