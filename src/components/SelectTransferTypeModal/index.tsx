import { useTranslation } from "react-i18next";

import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import useQuickTransferAccounts from "@/hooks/use-quick-transfer-accounts";
import useNavigation from "@/navigation/use-navigation";
import delayTransition from "@/utils/delay-transition";

import TransferOption from "./TransferOption";

export type InternalTransferEntryPoint = "homepage" | "payment-hub";

interface SelectTransferTypeModalProps {
  isVisible: boolean;
  onClose: () => void;
  setIsErrorModalVisible: (status: boolean) => void;
  entryPoint: InternalTransferEntryPoint;
}

export default function SelectTransferTypeModal({
  isVisible,
  onClose,
  setIsErrorModalVisible,
  entryPoint,
}: SelectTransferTypeModalProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const isActivatedQuickTransfer = useQuickTransferAccounts();
  const { setInternalTransferEntryPoint } = useInternalTransferContext();

  const handleOnQuickTransferPress = () => {
    onClose();

    if (isActivatedQuickTransfer?.status === "error") {
      setIsErrorModalVisible(true);
    } else if (isActivatedQuickTransfer?.data?.CustomerTermsConditionsFlag === "0") {
      delayTransition(() => {
        navigation.navigate("InternalTransfers.InternalTransfersStack", {
          screen: "InternalTransfers.TermsAndConditionsModal",
        });
      });
    } else if (isActivatedQuickTransfer?.data?.CustomerTermsConditionsFlag === "1") {
      navigation.navigate("InternalTransfers.InternalTransfersStack", {
        screen: "InternalTransfers.QuickTransferScreen",
      });
    }
  };

  const handleStandardTransferPress = () => {
    onClose();
    setInternalTransferEntryPoint(entryPoint);
    navigation.navigate("InternalTransfers.InternalTransfersStack", {
      screen: "InternalTransfers.StandardTransferScreen",
    });
  };

  return (
    <Modal
      onClose={onClose}
      visible={isVisible}
      headerText={t("LocalTransfers.SelectTransferTypeModal.selectTransferType")}>
      <Stack direction="vertical" gap="32p" align="stretch">
        <TransferOption
          onPress={handleOnQuickTransferPress}
          title={t("LocalTransfers.SelectTransferTypeModal.quickTransfer")}
          helperText={t("LocalTransfers.SelectTransferTypeModal.quickTransferDescription")}
        />
        <TransferOption
          onPress={handleStandardTransferPress}
          title={t("LocalTransfers.SelectTransferTypeModal.standardTransfer")}
          helperText={t("LocalTransfers.SelectTransferTypeModal.standardTransferDescription")}
        />
      </Stack>
    </Modal>
  );
}
