import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, AppState, AppStateStatus, DeviceEventEmitter, NativeEventSubscription, Platform } from "react-native";

import { useAuthContext } from "@/contexts/AuthContext";
import { warn } from "@/logger";

import { useGetAuthenticationToken } from "./use-api-authentication-token";
import { logoutActionsIds, useLogout } from "./use-logout";

// This is for background side user inactivity for 1 minute of time.
export default function useLogoutAfterBackgroundInactivity() {
  const logoutUser = useLogout();
  const { t } = useTranslation();
  const { mutateAsync: getAuthenticationToken } = useGetAuthenticationToken();

  const auth = useAuthContext();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const [wasBackgroundModeActive, setWasBackgroundModeActive] = useState<boolean>(false);
  const [backgroundTime, setBackgroundTime] = useState<number | null>(null);

  const handleLogout = async () => {
    try {
      const authentication = await getAuthenticationToken();
      await logoutUser.mutateAsync({ ActionId: logoutActionsIds.SIGNOUT_ONLY, token: authentication.AccessToken });
      Alert.alert(t("Alerts.LogoutDueToInactivity"));
    } catch (error) {
      warn("logout-api error: ", JSON.stringify(error));
    }
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState === "background" && nextAppState === "active") {
      const currentTime = Date.now();
      if (backgroundTime && currentTime - backgroundTime >= 60000) {
        handleLogout();
      }
      setBackgroundTime(null);
      timeoutRef.current = setTimeout(() => {
        // Setting this a little bit later because I need to know what was the app state before
        setWasBackgroundModeActive(false);
      }, 1);
    } else if (nextAppState === "background") {
      setBackgroundTime(Date.now());
      setWasBackgroundModeActive(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
    setAppState(nextAppState);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let subscription: NativeEventSubscription;
    // Will not run while development so that no one will be disturbed while development
    if (auth.isAuthenticated && !__DEV__) {
      if (Platform.OS === "ios") {
        subscription = AppState.addEventListener("change", handleAppStateChange);
      } else {
        subscription = DeviceEventEmitter.addListener("AppStateChange", handleAppStateChange);
      }
    }

    return () => {
      if (subscription) subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState, auth, backgroundTime]);

  return [appState, wasBackgroundModeActive];
}
