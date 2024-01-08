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
  onClose: (isError: boolean) => void;
}

export default function SignOutModal({ isVisible, onClose }: SignOutModalProps) {
  const { t } = useTranslation();
  const signOutUser = useLogout();
  const navigation = useNavigation();
  const { mutateAsync: getAuthenticationToken } = useGetAuthenticationToken();

  const handleOnSignOut = async () => {
    try {
      const authentication = await getAuthenticationToken();

      await signOutUser.mutateAsync({ ActionId: logoutActionsIds.SIGNOUT_ONLY, token: authentication.AccessToken });
      onClose(false);
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
      onClose(true);
      const typedError = error as Error;
      warn("logout-api error: ", typedError.message);
    }
  };

  return (
    <NotificationModal
      variant="warning"
      title={t("Settings.AccountSettings.youSure")}
      message=""
      isVisible={isVisible}
      buttons={{
        primary: <Button onPress={handleOnSignOut}>{t("Settings.AccountSettings.button")}</Button>,
        secondary: <Button onPress={() => onClose(false)}>{t("Settings.SignOutModal.cancelButton")}</Button>,
      }}
    />
  );
}
