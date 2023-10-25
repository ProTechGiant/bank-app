import { useTranslation } from "react-i18next";

import Modal from "@/components/Modal";
import Stack from "@/components/Stack";

import TransferOption from "./TransferOption";

interface InternalTransferTypeModalProps {
  onClose: () => void;
  onCroatiaPress: () => void;
  onAlrajhiPress: () => void;
  isVisible: boolean;
  testID?: string;
}

export default function InternalTransferTypeModal({
  onClose,
  onCroatiaPress,
  onAlrajhiPress,
  isVisible,
  testID,
}: InternalTransferTypeModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      onClose={onClose}
      headerText={t("InternalTransfers.SelectTransferTypeModal.selectTransferType")}
      visible={isVisible}
      testID={testID}>
      <Stack direction="vertical" gap="32p" align="stretch">
        <TransferOption
          onPress={onCroatiaPress}
          title={t("InternalTransfers.SelectTransferTypeModal.croatiaTransfer")}
          helperText={t("InternalTransfers.SelectTransferTypeModal.croatiaTransferDescription")}
          testID={testID !== undefined ? `${testID}-CroatiaTransferButton` : undefined}
        />
        <TransferOption
          onPress={onAlrajhiPress}
          title={t("InternalTransfers.SelectTransferTypeModal.alrajhiTransfer")}
          helperText={t("InternalTransfers.SelectTransferTypeModal.alrajhiTransferDescription")}
          testID={testID !== undefined ? `${testID}-AlRajhiTransferButton` : undefined}
        />
      </Stack>
    </Modal>
  );
}
