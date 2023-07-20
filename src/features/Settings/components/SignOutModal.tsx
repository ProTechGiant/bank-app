import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import NotificationModal from "@/components/NotificationModal";
import { useAuthContext } from "@/contexts/AuthContext";
import useLogout from "@/hooks/use-logout";
import { warn } from "@/logger";

interface SignOutModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function SignOutModal({ isVisible, onClose }: SignOutModalProps) {
  const { t } = useTranslation();
  const auth = useAuthContext();
  const signOutUser = useLogout();
  const handleOnSignOut = async () => {
    // TODO: when unAuthenticated stack is ready
    try {
      await signOutUser.mutateAsync();
      auth.logout();
      onClose();
    } catch (error) {
      const typedError = error as Error;
      warn("logout-api error: ", typedError.message);
    }
  };

  return (
    <NotificationModal
      variant="warning"
      title={t("Settings.SignOutModal.areYouSureSignOut")}
      message={t("Settings.SignOutModal.hintMessageSignOut")}
      isVisible={isVisible}
      onClose={onClose}
      buttons={{
        primary: <Button onPress={handleOnSignOut}>{t("Settings.SignOutModal.signOutButton")}</Button>,
        secondary: <Button onPress={onClose}>{t("Settings.SignOutModal.cancelButton")}</Button>,
      }}
    />
  );
}
