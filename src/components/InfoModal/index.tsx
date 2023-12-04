import { ViewStyle } from "react-native";

import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import { useThemeStyles } from "@/theme";

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
    borderTopStartRadius: theme.radii.xlarge,
    borderTopEndRadius: theme.radii.xlarge,
    paddingBottom: theme.padding.xlarge,
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
      </Stack>
    </Modal>
  );
}
