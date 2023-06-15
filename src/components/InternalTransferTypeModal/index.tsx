import { useTranslation } from "react-i18next";

import Modal from "@/components/Modal";
import Stack from "@/components/Stack";

import TransferOption from "./TransferOption";

interface InternalTransferTypeModalProps {
  onClose: () => void;
  onCroatiaPress: () => void;
  onAlrajhiPress: () => void;
}

export default function InternalTransferTypeModal({
  onClose,
  onCroatiaPress,
  onAlrajhiPress,
}: InternalTransferTypeModalProps) {
  const { t } = useTranslation();

  return (
    <Modal onClose={onClose} visible headerText={t("InternalTransfers.SelectTransferTypeModal.selectTransferType")}>
      <Stack direction="vertical" gap="32p" align="stretch">
        <TransferOption
          onPress={onCroatiaPress}
          title={t("InternalTransfers.SelectTransferTypeModal.croatiaTransfer")}
          helperText={t("InternalTransfers.SelectTransferTypeModal.croatiaTransferDescription")}
        />
        <TransferOption
          onPress={onAlrajhiPress}
          title={t("InternalTransfers.SelectTransferTypeModal.alrajhiTransfer")}
          helperText={t("InternalTransfers.SelectTransferTypeModal.alrajhiTransferDescription")}
        />
      </Stack>
    </Modal>
  );
}
