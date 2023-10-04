import { useEffect, useState } from "react";
import { AppState, AppStateStatus, DeviceEventEmitter, NativeEventSubscription, Platform } from "react-native";

import { useAuthContext } from "@/contexts/AuthContext";
import { warn } from "@/logger";

import useLogout, { logoutActionsIds } from "./use-logout";

export default function useLogoutAfterInactivity() {
  const logoutUser = useLogout();
  const auth = useAuthContext();
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  const handleLogout = async () => {
    try {
      await logoutUser(logoutActionsIds.AUTOMATIC_ID);
    } catch (error) {
      warn("logout-api error: ", JSON.stringify(error));
    }
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState === "background" && nextAppState === "active") {
      handleLogout();
    }
    setAppState(nextAppState);
  };

  useEffect(() => {
    let subscription: NativeEventSubscription;
    if (Platform.OS === "ios") {
      subscription = AppState.addEventListener("change", handleAppStateChange);
    } else {
      subscription = DeviceEventEmitter.addListener("AppStateChange", handleAppStateChange);
    }

    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState, auth]);
}
