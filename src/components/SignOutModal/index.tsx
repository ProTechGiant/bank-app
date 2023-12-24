import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import NotificationModal from "@/components/NotificationModal";
import useLogout, { logoutActionsIds } from "@/hooks/use-logout";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import delayTransition from "@/utils/delay-transition";
import { removeItemFromEncryptedStorage } from "@/utils/encrypted-storage";

interface SignOutModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCloseError: () => void;
  isRegisteredDevice: boolean;
}

export default function SignOutModal({ isVisible, onClose, onCloseError, isRegisteredDevice }: SignOutModalProps) {
  const { t } = useTranslation();
  const signOutUser = useLogout();
  const navigation = useNavigation();

  const handleOnSignOut = async (actionId: number) => {
    try {
      await signOutUser(actionId);
      onClose();
      await removeItemFromEncryptedStorage("user");
      delayTransition(() => {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "Onboarding.OnboardingStack",
              params: {
                screen: "Onboarding.SplashScreen",
              },
            },
          ],
        });
      });
    } catch (error) {
      onCloseError();
      const typedError = error as Error;
      warn("logout-api error: ", typedError.message);
    }
  };

  return (
    <NotificationModal
      variant="warning"
      title={t("Settings.Modal.signout.title")}
      message={
        isRegisteredDevice ? t("Settings.Modal.signout.stillBeRegistered") : t("Settings.Modal.signout.subTitle")
      }
      isVisible={isVisible}
      buttons={{
        primary: (
          <Button onPress={() => handleOnSignOut(logoutActionsIds.SIGNOUT_ONLY)}>
            {t("Settings.AccountSettings.button")}
          </Button>
        ),
        secondary: isRegisteredDevice ? (
          <Button onPress={() => handleOnSignOut(logoutActionsIds.SIGNOUT_DEREGISTER_DEVICE)}>
            {t("Settings.Modal.signout.unregisterDevice")}
          </Button>
        ) : (
          <Button onPress={onClose}>{t("Settings.SignOutModal.cancelButton")}</Button>
        ),
      }}
      onClose={onClose}
    />
  );
}
