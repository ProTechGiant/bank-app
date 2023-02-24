import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface ViewPinModalProps {
  pin: string;
  visible: boolean;
  onClose: () => void;
}

export default function ViewPinModal({ pin, visible, onClose }: ViewPinModalProps) {
  const { t } = useTranslation();

  const pinStyle = useThemeStyles<ViewStyle>(theme => ({
    letterSpacing: theme.spacing["20p"],
    paddingLeft: theme.spacing["20p"],
    marginVertical: 80,
  }));

  return (
    <Modal onClose={onClose} visible={visible} headerText={t("CardActions.ViewPin.navTitle")}>
      <Typography.Header style={pinStyle} size="large" weight="semiBold" align="center">
        {pin}
      </Typography.Header>
      <Button onPress={onClose}>{t("CardActions.ViewPin.button")}</Button>
    </Modal>
  );
}
