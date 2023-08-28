import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import NotificationModal from "@/components/NotificationModal";

interface CloseChattingNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  onPressOk: () => void;
  isLoading?: boolean;
}
export default function CloseChattingModal({
  isVisible,
  onClose,
  onPressOk,
  isLoading,
}: CloseChattingNotificationProps) {
  const { t } = useTranslation();

  return (
    <NotificationModal
      variant="warning"
      title={t("HelpAndSupport.LiveChatScreen.CloseChatModal.title")}
      message={t("HelpAndSupport.LiveChatScreen.CloseChatModal.message")}
      isVisible={isVisible}
      onClose={onClose}
      buttons={{
        primary: (
          <Button onPress={onPressOk} loading={isLoading}>
            {t("HelpAndSupport.LiveChatScreen.CloseChatModal.okButton")}
          </Button>
        ),
        secondary: <Button onPress={onClose}>{t("HelpAndSupport.LiveChatScreen.CloseChatModal.closeButton")}</Button>,
      }}
    />
  );
}
