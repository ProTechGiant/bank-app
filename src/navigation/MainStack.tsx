import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";
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

import { useAuthContext } from "@/contexts/AuthContext";
import { useDeepLinkHandler } from "@/hooks/use-deeplink-handler";
import useLogout, { logoutActionsIds } from "@/hooks/use-logout";
import { navigationRef } from "@/navigation/NavigationService";
import useNavigation from "@/navigation/use-navigation";

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
const TIMEOUT_MS = 300000; // 5 minutes

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

  const { isAuthenticated, setNotificationsReadStatus, updateNavigationTarget } = useAuthContext();
  const logoutUser = useLogout();

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
        <UserInactivity
          isActive={true}
          timeForInactivity={TIMEOUT_MS}
          onAction={async isActive => {
            if (!isActive) {
              try {
                await logoutUser(logoutActionsIds.AUTOMATIC_ID);
                Alert.alert(t("Alerts.LogoutDueToInactivity"));
              } catch (err) {}
            }
          }}
          style={styles.userInactivityContainer}>
          <AuthenticatedScreens />
        </UserInactivity>
      ) : (
        <UnauthenticatedScreens />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  userInactivityContainer: { flex: 1 },
});
