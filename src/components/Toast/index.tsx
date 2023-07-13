import { cloneElement } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { SvgProps } from "react-native-svg";

import { CloseIcon, ErrorFilledCircleIcon, TickCircleIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface ToastProps {
  onClose?: () => void;
  icon?: React.ReactElement<SvgProps>;
  message: string;
  variant: "confirm" | "warning" | "negative" | "success";
  testID?: string;
}

const VARIANT_ICONS = {
  success: <TickCircleIcon />,
  confirm: <TickCircleIcon />,
  warning: <ErrorFilledCircleIcon />,
  negative: <ErrorFilledCircleIcon />,
};

// @see https://www.figma.com/file/tl0ZMqLtY3o72AtiWUSgmc/Brand-Design-System?type=design&node-id=1503-8659&t=ixyhoCSGO91Uokxq-0
export default function Toast({ onClose, icon, variant = "confirm", message, testID }: ToastProps) {
  const contentContainerStyles = useThemeStyles<ViewStyle>(theme => ({
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 32,
    elevation: 5,
    backgroundColor: variant === "success" ? theme.palette.successBase : theme.palette["neutralBase-60"],
    borderRadius: theme.radii.medium,
    borderColor: theme.palette["neutralBase-30"],
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    columnGap: theme.spacing["16p"],
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  const animationContainerStyles = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    zIndex: 100,
    alignSelf: "center",
    margin: theme.spacing["20p"],
    top: theme.spacing["20p"],
    alignContent: "center",
  }));

  const variantIconColor = useThemeStyles(
    ({ palette }) =>
      variant === "confirm"
        ? palette["primaryBase-40"]
        : variant === "warning"
        ? palette.warningBase
        : variant === "success"
        ? palette.successBase
        : palette["errorBase-10"],
    [variant]
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
        : palette["errorBase-10"],
    [variant]
  );

  return (
    <Animated.View style={[animationContainerStyles]} testID={testID} entering={FadeInUp} exiting={FadeOutUp}>
      <View style={contentContainerStyles}>
        {icon !== undefined
          ? cloneElement(icon, { ...styles.icon })
          : cloneElement(VARIANT_ICONS[variant], { ...styles.icon, color: variantIconColor })}

        <Typography.Text color="neutralBase+30" weight="regular" size="footnote">
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
