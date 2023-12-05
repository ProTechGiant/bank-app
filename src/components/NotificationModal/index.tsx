import { cloneElement, ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { CancelCircleFilledIcon, IconProps, TickCircleBorderIcon, WarningFilledCircleIcon } from "@/assets/icons";
import { ButtonProps } from "@/components/Button";
import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface NotificationModalProps {
  buttons?:
    | {
        primary: React.ReactElement<ButtonProps>;
        secondary?: React.ReactElement<ButtonProps>;
      }
    | false;
  onClose?: () => void;
  message?: string;
  isVisible: boolean;
  title: string;
  variant: "success" | "error" | "warning" | "confirmations";
  icon?: React.ReactElement<SvgProps | IconProps>;
  testID?: string;
  children?: ReactNode;
}

const VARIANT_ICONS = {
  success: <TickCircleBorderIcon />,
  error: <CancelCircleFilledIcon />,
  warning: <WarningFilledCircleIcon />,
};

// @see https://www.figma.com/file/QOqqlaJOVnmvKjmRqIPryO/Croatia-Core-Theme?node-id=2669%3A12208&t=48I2T8XT844CfKFB-0
export default function NotificationModal({
  buttons,
  onClose,
  message,
  isVisible,
  testID,
  title,
  variant,
  icon,
  children,
}: NotificationModalProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    marginTop: theme.spacing["16p"],
  }));

  const containerWithButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: -theme.spacing["32p"],
  }));

  const variantIconStyles = useThemeStyles<IconProps>(
    ({ palette }) => ({
      ...styles.iconStyles,
      color:
        variant === "success" ? palette.successBase : variant === "error" ? palette.errorBase : palette.warningBase,
    }),
    [variant]
  );

  const modalStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.xlarge,
    borderTopStartRadius: theme.radii.xlarge,
    borderTopEndRadius: theme.radii.xlarge,
    marginBottom: theme.spacing["32p"],
    marginHorizontal: theme.spacing["12p"],
  }));

  const buttonsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["32p"],
    width: "100%",
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  return (
    <Modal visible={isVisible} style={modalStyle} onClose={onClose} padding="24p" testID={testID}>
      <View style={[containerStyle, onClose !== undefined && containerWithButtonStyle]}>
        {variant !== "confirmations" ? (
          <View>{cloneElement(VARIANT_ICONS[variant], variantIconStyles)}</View>
        ) : icon !== undefined ? (
          <View>{cloneElement(icon)}</View>
        ) : null}
        <Stack direction="vertical" gap="16p" align="center" style={contentStyle}>
          <Typography.Text color="neutralBase+30" weight="medium" size="title2" align="center">
            {title}
          </Typography.Text>
          {message !== undefined ? (
            <Typography.Text color="neutralBase+10" weight="regular" size="callout" align="center">
              {message}
            </Typography.Text>
          ) : null}
        </Stack>
        {children}
        {buttons !== undefined && buttons !== false ? (
          <Stack align="stretch" direction="vertical" gap="4p" style={buttonsContainerStyle}>
            {cloneElement(buttons.primary, { variant: "primary" })}
            {buttons.secondary !== undefined ? cloneElement(buttons.secondary, { variant: "tertiary" }) : null}
          </Stack>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  iconStyles: {
    height: 78,
    width: 81,
  },
});
