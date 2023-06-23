import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import NotificationModal from "@/components/NotificationModal";

interface SwitchToARBModalProps {
  isVisible: boolean;
  onSwitchToARBPress: () => void;
  onCancelPress: () => void;
}

export default function SwitchToARBModal({ isVisible, onSwitchToARBPress, onCancelPress }: SwitchToARBModalProps) {
  const { t } = useTranslation();

  return (
    <NotificationModal
      variant="warning"
      title={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.SwitchToARB.title")}
      message=""
      isVisible={isVisible}
      buttons={{
        primary: (
          <Button onPress={onSwitchToARBPress}>
            {t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.SwitchToARB.buttons.switchToInternalTransfer")}
          </Button>
        ),
        secondary: (
          <Button onPress={onCancelPress}>
            {t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.SwitchToARB.buttons.cancelButton")}
          </Button>
        ),
      }}
    />
  );
}
