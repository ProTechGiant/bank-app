import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import NotificationModal from "@/components/NotificationModal";

interface SwitchToARBModalProps {
  isVisible: boolean;
  onSwitchToARBPress: () => void;
  onCancelPress: () => void;
  testID?: string;
}

export default function SwitchToARBModal({
  isVisible,
  onSwitchToARBPress,
  onCancelPress,
  testID,
}: SwitchToARBModalProps) {
  const { t } = useTranslation();

  return (
    <NotificationModal
      variant="warning"
      title={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.SwitchToARB.title")}
      message=""
      isVisible={isVisible}
      buttons={{
        primary: (
          <Button
            onPress={onSwitchToARBPress}
            testID={testID !== undefined ? `${testID}-SwitchInternalTransferButton` : undefined}>
            {t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.SwitchToARB.buttons.switchToInternalTransfer")}
          </Button>
        ),
        secondary: (
          <Button onPress={onCancelPress} testID={testID !== undefined ? `${testID}-CancelButton` : undefined}>
            {t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.SwitchToARB.buttons.cancelButton")}
          </Button>
        ),
      }}
    />
  );
}
