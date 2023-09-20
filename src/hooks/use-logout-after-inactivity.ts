import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, AppState, AppStateStatus } from "react-native";

import { useAuthContext } from "@/contexts/AuthContext";

import useLogout, { logoutActionsIds } from "./use-logout";

export default function useLogoutAfterInactivity() {
  const { t } = useTranslation();
  const logoutUser = useLogout();
  const auth = useAuthContext();
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logoutUser(logoutActionsIds.AUTOMATIC_ID);
      } catch (error) {
        warn("logout-api error: ", error);
      }
      Alert.alert(t("Alerts.LogoutDueToInactivity"));
    };

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      //We check for the app current state and we only want to handle case when app was previously in background mode
      if ((appState === "inactive" || appState === "background") && nextAppState === "active") {
        handleLogout();
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState, auth]);
}
