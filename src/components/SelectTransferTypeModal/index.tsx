import { useTranslation } from "react-i18next";

import Modal from "@/components/Modal";
import Stack from "@/components/Stack";

import TransferOption from "./TransferOption";

interface SelectTransferTypeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCroatiaPress: () => void;
  onAlrajhiPress: () => void;
  onLocalTransferPress: () => void;
  testID?: string;
}

export default function SelectTransferTypeModal({
  isVisible,
  onClose,
  onCroatiaPress,
  onAlrajhiPress,
  onLocalTransferPress,
  testID,
}: SelectTransferTypeModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      onClose={onClose}
      visible={isVisible}
      headerText={t("InternalTransfers.SelectTransferTypeModal.selectTransferType")}
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
        <TransferOption
          onPress={onLocalTransferPress}
          title={t("InternalTransfers.SelectTransferTypeModal.localTransfer")}
          helperText={t("InternalTransfers.SelectTransferTypeModal.localTransferDescription")}
          testID={testID !== undefined ? `${testID}-LocalTransferButton` : undefined}
        />
      </Stack>
    </Modal>
  );
}
