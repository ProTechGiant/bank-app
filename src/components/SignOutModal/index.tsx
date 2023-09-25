import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import NotificationModal from "@/components/NotificationModal";
import useLogout, { logoutActionsIds } from "@/hooks/use-logout";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import delayTransition from "@/utils/delay-transition";

interface SignOutModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCloseError: () => void;
}

export default function SignOutModal({ isVisible, onClose, onCloseError }: SignOutModalProps) {
  const { t } = useTranslation();
  const signOutUser = useLogout();
  const navigation = useNavigation();

  const handleOnSignOut = async () => {
    try {
      await signOutUser(logoutActionsIds.MANUALLY_ID);
      onClose();
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
