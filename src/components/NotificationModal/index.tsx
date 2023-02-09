import { cloneElement } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { TickCircleBorderIcon } from "@/assets/icons";
import { ButtonProps } from "@/components/Button";
import Modal from "@/components/Modal";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import Stack from "../Stack";

interface NotificationModalProps {
  icon?: React.ReactElement<SvgProps>;
  title?: string;
  message: string;
  isVisible: boolean;
  testID?: string;
  primaryButton?: React.ReactElement<ButtonProps>;
  secondaryButton?: React.ReactElement<ButtonProps>;
  onClose?: () => void;
}

export default function NotificationModal({
  icon = <TickCircleBorderIcon />,
  isVisible,
  title,
  message,
  primaryButton,
  secondaryButton,
  onClose,
  testID,
}: NotificationModalProps) {
  const iconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["20p"],
  }));
  const modalStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["48p"],
    marginHorizontal: theme.spacing["16p"],
    borderRadius: theme.radii.small,
    paddingBottom: theme.spacing["24p"],
  }));
  const buttonsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["32p"],
    width: "100%",
  }));

  const iconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.notificationTick);

  return (
    <Modal visible={isVisible} style={modalStyle} onClose={onClose}>
      <View style={styles.container} testID={testID}>
        {icon && (
          <View style={iconContainerStyle}>
            {cloneElement(icon, { height: iconDimensions, width: iconDimensions })}
          </View>
        )}
        <Stack direction="vertical" gap="16p" align="center">
          <Typography.Text color="neutralBase+30" weight="bold" size="title2" style={styles.text}>
            {title}
          </Typography.Text>
          <Typography.Text color="neutralBase+30" weight="regular" size="callout" style={styles.text}>
            {message}
          </Typography.Text>
        </Stack>
        <View style={buttonsContainerStyle}>
          {primaryButton}
          {secondaryButton}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  text: {
    textAlign: "center",
  },
});
