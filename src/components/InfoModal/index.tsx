import Modal from "@/components/Modal";
import Stack from "@/components/Stack";

import Typography from "../Typography";

interface InfoModalProps {
  isVisible: boolean;
  onClose: () => void;
  headerText?: string;
  title: string;
  description: string;
}

export default function InfoModal({ isVisible, onClose, headerText, title, description }: InfoModalProps) {
  return (
    <Modal onClose={onClose} visible={isVisible} headerText={headerText}>
      <Stack direction="vertical" gap="32p" align="stretch">
        <Typography.Text size="title2" weight="medium" color="neutralBase+30">
          {title}
        </Typography.Text>
        <Typography.Text size="callout" weight="regular" color="neutralBase">
          {description}
        </Typography.Text>
      </Stack>
    </Modal>
  );
}
