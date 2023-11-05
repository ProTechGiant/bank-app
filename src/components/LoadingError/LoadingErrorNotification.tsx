import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import NotificationModal from "@/components/NotificationModal";

interface LoadingErrorNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  onRefresh: () => void;
  testID?: string;
}

export default function LoadingErrorNotification({
  isVisible,
  onClose,
  onRefresh,
  testID,
}: LoadingErrorNotificationProps) {
  const { t } = useTranslation();

  return (
    <NotificationModal
      testID={testID !== undefined ? `${testID}:NotificationModal` : undefined}
      variant="error"
      title={t("LoadingError.NotificationModal.errorTitle")}
      message={t("LoadingError.NotificationModal.errorMessage")}
      isVisible={isVisible}
      onClose={onClose}
      buttons={{
        primary: (
          <Button testID={testID !== undefined ? `${testID}-ModalRefreshButton` : undefined} onPress={onRefresh}>
            {t("LoadingError.NotificationModal.refresh")}
          </Button>
        ),
        secondary: (
          <Button testID={testID !== undefined ? `${testID}-ModalRefreshClose` : undefined} onPress={onClose}>
            {t("LoadingError.NotificationModal.dismiss")}
          </Button>
        ),
      }}
    />
  );
}
