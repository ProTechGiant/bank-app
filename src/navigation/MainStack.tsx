import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  DeviceEventEmitter,
  DeviceEventEmitterStatic,
  NativeEventEmitter,
  NativeModules,
  Platform,
  StyleSheet,
} from "react-native";
import UserInactivity from "react-native-user-inactivity";

import Button from "@/components/Button";
import NotificationModal from "@/components/NotificationModal";
import { useAuthContext } from "@/contexts/AuthContext";
import { useGetAuthenticationToken, useRefreshAuthenticationToken } from "@/hooks/use-api-authentication-token";
import { useDeepLinkHandler } from "@/hooks/use-deeplink-handler";
import { logoutActionsIds, useLogout } from "@/hooks/use-logout";
import useLogoutAfterBackgroundInactivity from "@/hooks/use-logout-after-background-inactivity";
import { navigationRef } from "@/navigation/NavigationService";
import useNavigation from "@/navigation/use-navigation";
import delayTransition from "@/utils/delay-transition";

import { AuthenticatedScreens } from "./AuthenticatedStack";
import { UnauthenticatedScreens } from "./UnAuthenticatedStack";

let pushNotificationEvents: DeviceEventEmitterStatic | NativeEventEmitter;
if (Platform.OS === "android") {
  pushNotificationEvents = DeviceEventEmitter;
} else {
  pushNotificationEvents = new NativeEventEmitter(NativeModules.T2PushNotificationsModule);
}

interface MainStackProps {
  onReady: () => void;
}
const TIMEOUT_MS = 120000; // 1 minute

export default function MainStack({ onReady }: MainStackProps) {
  useDeepLinkHandler();
  return (
    <NavigationContainer onReady={onReady} ref={navigationRef}>
      <AppWrapper />
    </NavigationContainer>
  );
}

const AppWrapper = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [sessionExpiryModalVisible, setSessionExpiryModalVisible] = useState<boolean>(false);
  const [inactivityTimeCompleted, setInactivityTimeCompleted] = useState<boolean>(false);
  const { mutateAsync: refreshAuthenticationToken, isLoading: isRefreshTokenLoading } = useRefreshAuthenticationToken();
  const { isAuthenticated, setNotificationsReadStatus, updateNavigationTarget } = useAuthContext();
  const [appState, wasBackgroundModeActive] = useLogoutAfterBackgroundInactivity();
  const logoutUser = useLogout();
  const { mutateAsync: getAuthenticationToken } = useGetAuthenticationToken();

  const handleOnExtendSession = async () => {
    try {
      await refreshAuthenticationToken();
      setSessionExpiryModalVisible(false);
    } catch (err) {}
  };

  // Here we will show the expire session notification modal
  useEffect(() => {
    if (inactivityTimeCompleted && !wasBackgroundModeActive) {
      setSessionExpiryModalVisible(true);
      setInactivityTimeCompleted(false);
    } else {
      setInactivityTimeCompleted(false);
    }
  }, [inactivityTimeCompleted, wasBackgroundModeActive]);

  // Logging out user after 15 second of when modal will show
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionExpiryModalVisible && isAuthenticated) {
      interval = setTimeout(async () => {
        setSessionExpiryModalVisible(false);
        const authentication = await getAuthenticationToken();

        await logoutUser.mutateAsync({ ActionId: logoutActionsIds.SIGNOUT_ONLY, token: authentication.AccessToken });
        delayTransition(() => {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "SignIn.SignInStack",
                params: {
                  screen: "SignIn.iqama",
                },
              },
            ],
          });
        });
        Alert.alert(t("Alerts.LogoutDueToInactivity"));
      }, 15000);
    }

    return () => clearTimeout(interval);
  }, [sessionExpiryModalVisible, isAuthenticated]);

  useEffect(() => {
    const notificationTappedSubscription = pushNotificationEvents.addListener("notificationTapped", response => {
      let navigationTarget = response;
      if (Platform.OS === "android") {
        navigationTarget = JSON.parse(response);
      }
      updateNavigationTarget(navigationTarget);
      navigation.navigate(navigationTarget.stack, { screen: navigationTarget.screen });
    });

    return () => {
      notificationTappedSubscription.remove();
    };
  }, [navigation, updateNavigationTarget]);

  useEffect(() => {
    const notificationReceivedSubscription = pushNotificationEvents.addListener("notificationReceived", _result => {
      setNotificationsReadStatus(false);
    });

    return () => {
      notificationReceivedSubscription.remove();
    };
  }, [setNotificationsReadStatus]);

  return (
    <>
      {isAuthenticated ? (
        <>
          {/* This is for Fontend Side User Inactivity */}
          <UserInactivity
            // Don't need for this if sessionExpiryModal is visible
            isActive={appState === "active" && !sessionExpiryModalVisible}
            timeForInactivity={TIMEOUT_MS}
            onAction={async isActive => {
              // Will not run while development so that no one will be disturbed while development
              if (!isActive && !__DEV__) {
                setInactivityTimeCompleted(true);
              }
            }}
            style={styles.userInactivityContainer}>
            <AuthenticatedScreens />
            <NotificationModal
              isVisible={sessionExpiryModalVisible}
              message={t("Alerts.sessionAboutToExpire")}
              title={t("Alerts.timeReminder")}
              variant="warning"
              buttons={{
                primary: (
                  <Button
                    loading={isRefreshTokenLoading}
                    disabled={isRefreshTokenLoading}
                    onPress={handleOnExtendSession}>
                    {t("Alerts.yes")}
                  </Button>
                ),
              }}
            />
          </UserInactivity>
        </>
      ) : (
        <UnauthenticatedScreens />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  userInactivityContainer: { flex: 1 },
});
