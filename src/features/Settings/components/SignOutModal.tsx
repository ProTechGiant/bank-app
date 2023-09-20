import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import NotificationModal from "@/components/NotificationModal";
import useLogout, { logoutActionsIds } from "@/hooks/use-logout";
import { warn } from "@/logger";

interface SignOutModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function SignOutModal({ isVisible, onClose }: SignOutModalProps) {
  const { t } = useTranslation();
  const signOutUser = useLogout();

  const handleOnSignOut = async () => {
    try {
      await signOutUser(logoutActionsIds.MANUALLY_ID);
      onClose();
    } catch (error) {
      const typedError = error as Error;
      warn("logout-api error: ", typedError.message);
    }
  };

  return (
    <NotificationModal
      variant="warning"
      title={t("Settings.AccountSettings.youSure")}
      message={t("Settings.AccountSettings.message")}
      isVisible={isVisible}
      buttons={{
        primary: <Button onPress={handleOnSignOut}>{t("Settings.AccountSettings.button")}</Button>,
        secondary: <Button onPress={onClose}>{t("Settings.SignOutModal.cancelButton")}</Button>,
      }}
    />
  );
}
