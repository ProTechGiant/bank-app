import { useTranslation } from "react-i18next";

import Modal from "@/components/Modal";
import Stack from "@/components/Stack";

import TransferOption from "./TransferOption";

interface SelectTransferTypeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onQuickTransferPress: () => void;
  onStandardTransferPress: () => void;
}

export default function SelectTransferTypeModal({
  isVisible,
  onClose,
  onQuickTransferPress,
  onStandardTransferPress,
}: SelectTransferTypeModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      onClose={onClose}
      visible={isVisible}
      headerText={t("LocalTransfers.SelectTransferTypeModal.selectTransferType")}>
      <Stack direction="vertical" gap="32p" align="stretch">
        <TransferOption
          onPress={onQuickTransferPress}
          title={t("LocalTransfers.SelectTransferTypeModal.quickTransfer")}
          helperText={t("LocalTransfers.SelectTransferTypeModal.quickTransferDescription")}
        />
        <TransferOption
          onPress={onStandardTransferPress}
          title={t("LocalTransfers.SelectTransferTypeModal.standardTransfer")}
          helperText={t("LocalTransfers.SelectTransferTypeModal.standardTransferDescription")}
        />
      </Stack>
    </Modal>
  );
}
