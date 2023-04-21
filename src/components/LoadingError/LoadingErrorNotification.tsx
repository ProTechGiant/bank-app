import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import NotificationModal from "@/components/NotificationModal";

interface LoadingErrorNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export default function LoadingErrorNotification({ isVisible, onClose, onRefresh }: LoadingErrorNotificationProps) {
  const { t } = useTranslation();

  return (
    <NotificationModal
      variant="error"
      title={t("LoadingError.NotificationModal.errorTitle")}
      message={t("LoadingError.NotificationModal.errorMessage")}
      isVisible={isVisible}
      onClose={onClose}
      buttons={{
        primary: <Button onPress={onRefresh}>{t("LoadingError.NotificationModal.refresh")}</Button>,
        secondary: <Button onPress={onClose}>{t("LoadingError.NotificationModal.dismiss")}</Button>,
      }}
    />
  );
}
