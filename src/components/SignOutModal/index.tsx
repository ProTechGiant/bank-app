import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import NotificationModal from "@/components/NotificationModal";
import { useGetAuthenticationToken } from "@/hooks/use-api-authentication-token";
import { logoutActionsIds, useLogout } from "@/hooks/use-logout";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import delayTransition from "@/utils/delay-transition";

interface SignOutModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCloseError: () => void;
  isRegisteredDevice: boolean;
}

export default function SignOutModal({ isVisible, onClose, onCloseError, isRegisteredDevice }: SignOutModalProps) {
  const { t } = useTranslation();
  const { mutateAsync: signOutUser } = useLogout();
  const navigation = useNavigation();
  const { mutateAsync: getAuthenticationToken } = useGetAuthenticationToken();
  const handleOnSignOut = async (actionId: number) => {
    try {
      const authentication = await getAuthenticationToken();
      const finalActionId = isRegisteredDevice ? actionId : logoutActionsIds.SIGNOUT_DEREGISTER_DEVICE;
      await signOutUser({ ActionId: finalActionId, token: authentication.AccessToken, logoutUsingAccount: true });
      onClose();
      delayTransition(() => {
        const routes = [
          {
            name: "Onboarding.OnboardingStack",
            params: {
              screen: "Onboarding.SplashScreen",
            },
          },
        ];

        if (finalActionId === logoutActionsIds.SIGNOUT_DEREGISTER_DEVICE) {
          routes.push({
            name: "SignIn.SignInStack",
            params: {
              screen: "SignIn.Iqama",
            },
          });
        }

        navigation.reset({
          index: 0,
          routes: routes,
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
