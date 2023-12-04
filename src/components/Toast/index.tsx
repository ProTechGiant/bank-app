import { cloneElement } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { SvgProps } from "react-native-svg";

import { CloseIcon, InfoCircleIcon, TickCircleIcon, TickCircleOutlineIcon, WarningTriangleIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface ToastProps {
  onClose?: () => void;
  icon?: React.ReactElement<SvgProps>;
  message: string;
  variant: "confirm" | "warning" | "negative" | "success";
  testID?: string;
  position?: "top" | "bottom";
  isDark?: boolean;
}

const VARIANT_ICONS = {
  success: <TickCircleOutlineIcon />,
  confirm: <TickCircleIcon />,
  warning: <WarningTriangleIcon />,
  negative: <InfoCircleIcon />,
};

// @see https://www.figma.com/file/tl0ZMqLtY3o72AtiWUSgmc/Brand-Design-System?type=design&node-id=1503-8659&t=ixyhoCSGO91Uokxq-0
export default function Toast({
  onClose,
  icon,
  variant = "confirm",
  message,
  testID,
  position = "top",
  isDark,
}: ToastProps) {
  const contentContainerStyles = useThemeStyles<ViewStyle>(theme => ({
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 32,
    width: "94%",
    elevation: 5,
    borderRadius: theme.radii.medium,
    borderColor: theme.palette["neutralBase-30"],
    borderWidth: 0.5,
    alignItems: "center",
    flexDirection: "row",
    columnGap: theme.spacing["16p"],
    paddingVertical: theme.spacing["16p"],
    marginHorizontal: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  const animationContainerStyles = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    zIndex: 100,
    alignSelf: "center",
    margin: theme.spacing["20p"],
    [position]: theme.spacing["20p"],
    alignContent: "center",
  }));

  const variantBorderRadius = useThemeStyles(
    ({ radii }) => (variant === "success" || variant === "negative" ? radii.medium : radii.small),
    [variant]
  );

  const variantIconColor = useThemeStyles(
    ({ palette }) =>
      !isDark
        ? palette["neutralBase+30"]
        : variant === "confirm"
        ? palette["primaryBase-40"]
        : variant === "warning"
        ? palette["warningBase-10"]
        : variant === "success"
        ? palette["successBase-10"]
        : palette["errorBase-10"],
    [variant]
  );

  const variantBackgroundColor = useThemeStyles(
    ({ palette }) =>
      isDark
        ? palette["neutralBase+30"]
        : variant === "confirm"
        ? palette["primaryBase-40"]
        : variant === "warning"
        ? palette["warningBase-30"]
        : variant === "success"
        ? palette["successBase-30"]
        : variant === "negative"
        ? palette["errorBase-30"]
        : palette["neutralBase-60"],
    [variant, isDark]
  );

  // Declared this, in case you want to use a different color for the close icon. As for now, black color is needed for the success variant.
  const closeIconColor = useThemeStyles(
    ({ palette }) =>
      variant === "confirm"
        ? palette["primaryBase-40"]
        : variant === "warning"
        ? palette.warningBase
        : variant === "success"
        ? palette["neutralBase+30"]
        : palette["neutralBase+30"],
    [variant]
  );

  return (
    <Animated.View style={[animationContainerStyles]} testID={testID} entering={FadeInUp} exiting={FadeOutUp}>
      <View
        style={[
          contentContainerStyles,
          { backgroundColor: variantBackgroundColor, borderRadius: variantBorderRadius },
        ]}>
        {icon !== undefined
          ? cloneElement(icon, { ...styles.icon })
          : cloneElement(VARIANT_ICONS[variant], { ...styles.icon, color: variantIconColor })}

        <Typography.Text color={isDark ? "neutralBase-60" : "neutralBase+30"} weight="regular" size="footnote">
          {message}
        </Typography.Text>
        {onClose !== undefined && (
          <Pressable onPress={onClose}>
            <CloseIcon color={closeIconColor} width={20} height={20} />
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  icon: {
    height: 20,
    width: 20,
  },
});
