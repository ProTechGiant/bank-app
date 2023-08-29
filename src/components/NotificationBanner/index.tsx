import { cloneElement } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { SvgProps } from "react-native-svg";

import { CloseIcon, ErrorFilledCircleIcon, TickCircleIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface NotificationBannerProps {
  onClose?: () => void; //incase we will need it for notifications so also added it
  onClick: () => void;
  icon?: React.ReactElement<SvgProps>;
  message: string;
  variant: "negative" | "success";
  testID?: string;
  position?: "top" | "bottom";
}

const VARIANT_ICONS = {
  success: <TickCircleIcon />,
  negative: <ErrorFilledCircleIcon />,
};

export default function NotificationBanner({
  icon,
  variant = "success",
  message,
  testID,
  position = "top",
  onClose,
  onClick,
}: NotificationBannerProps) {
  const { t } = useTranslation();

  const contentContainerStyles = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    flexDirection: "row",
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["12p"],
    columnGap: theme.spacing["16p"],
  }));

  const animationContainerStyles = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    zIndex: 100,
    alignSelf: "center",
    margin: theme.spacing["20p"],
    [position]: theme.spacing["20p"],
    alignContent: "center",
  }));

  const variantIconColor = useThemeStyles(
    ({ palette }) => (variant === "success" ? palette.successBase : palette.errorBase),
    [variant]
  );

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "center",
    alignContent: "center",
    borderRadius: theme.radii.xlarge,
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["12p"],
  }));

  const variantBackgroundColor = useThemeStyles(
    ({ palette }) => (variant === "success" ? palette["successBase-20"] : palette["errorBase-10"]),
    [variant]
  );

  const buttonBackgroundColor = useThemeStyles(
    ({ palette }) => (variant === "success" ? palette.successBase : palette.errorBase),
    [variant]
  );

  const closeIconColor = useThemeStyles(
    ({ palette }) => (variant === "success" ? palette.successBase : palette.errorBase),
    [variant]
  );

  return (
    <Animated.View style={[animationContainerStyles]} testID={testID} entering={FadeInUp} exiting={FadeOutUp}>
      <View style={[contentContainerStyles, { backgroundColor: variantBackgroundColor }]}>
        {icon !== undefined
          ? cloneElement(icon, { ...styles.icon })
          : cloneElement(VARIANT_ICONS[variant], { ...styles.icon, color: variantIconColor })}

        <Typography.Text style={styles.textStyle} color="neutralBase+30" weight="regular" size="footnote">
          {message}
        </Typography.Text>
        <Pressable onPress={onClick} style={[buttonStyle, { backgroundColor: buttonBackgroundColor }]}>
          <Typography.Text color="neutralBase-50" weight="medium" size="footnote">
            {t("NotificationBanner.buttonText")}
          </Typography.Text>
        </Pressable>
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
  textStyle: {
    alignSelf: "center",
    maxWidth: "65%",
  },
});
