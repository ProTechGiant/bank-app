import { t } from "i18next";
import { ViewStyle } from "react-native";

import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import { useThemeStyles } from "@/theme";

import Button from "../Button";
import Typography from "../Typography";

interface InfoModalProps {
  isVisible: boolean;
  onClose: () => void;
  headerText?: string;
  title: string;
  description: string;
}

export default function InfoModal({ isVisible, onClose, headerText, title, description }: InfoModalProps) {
  const modalStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.xlarge,
    borderTopStartRadius: theme.radii.xlarge,
    borderTopEndRadius: theme.radii.xlarge,
    marginBottom: theme.spacing["32p"],
    marginHorizontal: theme.spacing["16p"],
  }));

  return (
    <Modal onClose={onClose} visible={isVisible} headerText={headerText} style={modalStyle} padding="24p">
      <Stack direction="vertical" gap="32p" align="stretch">
        <Stack direction="vertical" gap="16p">
          <Typography.Text size="title2" weight="medium" color="neutralBase+30">
            {title}
          </Typography.Text>
          <Typography.Text size="callout" weight="regular" color="neutralBase">
            {description}
          </Typography.Text>
        </Stack>
        <Button onPress={onClose}>{t("InfoModal.closeButtonText")}</Button>
      </Stack>
    </Modal>
  );
}
