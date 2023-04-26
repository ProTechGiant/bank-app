import { cloneElement } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import {
  CancelCircleFilledIcon,
  IconProps,
  TickCircleBorderIcon,
  WarningFilledCircleIcon,
} from "@/assets/icons";
import { ButtonProps } from "@/components/Button";
import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface NotificationModalProps {
  buttons?:
    | {
        primary: React.ReactElement<ButtonProps>;
        secondary?: React.ReactElement<ButtonProps> | undefined;
      }
    | false;
  onClose?: () => void;
  message: string;
  isVisible: boolean;
  title: string;
  variant: "success" | "error" | "warning" | "confirmations";
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
  title,
  variant,
}: NotificationModalProps) {
  const iconContainerStyles = useThemeStyles(theme => ({
    paddingTop: theme.spacing["20p"],
  }));

  const iconStyles = useThemeStyles<IconProps>(
    ({ palette }) => ({
      color:
        variant === "success" ? palette.successBase : variant === "error" ? palette.errorBase : palette.warningBase,
      height: 50,
      width: 50,
    }),
    [variant]
  );

  const modalStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.xlarge,
    borderTopStartRadius: theme.radii.xlarge,
    borderTopEndRadius: theme.radii.xlarge,
    marginBottom: theme.spacing["32p"],
    marginHorizontal: theme.spacing["16p"],
  }));

  const spacerStyle = useThemeStyles<ViewStyle>(theme => ({
    height: theme.spacing["24p"],
  }));

  const buttonsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    width: "100%",
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    marginHorizontal: theme.spacing["16p"],
  }));

  return (
    <Modal
      visible={isVisible}
      style={modalStyle}
      onClose={undefined === buttons || buttons === false ? onClose : undefined}>
      <View style={styles.container}>
        {variant !== "confirmations" && (
          <View style={iconContainerStyles}>{cloneElement(VARIANT_ICONS[variant], iconStyles)}</View>
        )}
        <Stack direction="vertical" gap="16p" align="center" style={contentStyle}>
          <Typography.Text color="neutralBase+30" weight="bold" size="title2" align="center">
            {title}
          </Typography.Text>
          <Typography.Text color="neutralBase+30" weight="regular" size="callout" align="center">
            {message}
          </Typography.Text>
        </Stack>
        {undefined !== buttons && buttons !== false ? (
          <Stack align="stretch" direction="vertical" gap="4p" style={buttonsContainerStyle}>
            {cloneElement(buttons.primary, { variant: "primary" })}
            {buttons.secondary !== undefined ? cloneElement(buttons.secondary, { variant: "tertiary" }) : null}
          </Stack>
        ) : (
          <View style={spacerStyle} />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});
