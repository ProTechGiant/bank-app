import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, AppState, AppStateStatus } from "react-native";

import { useAuthContext } from "@/contexts/AuthContext";
import {
  getItemFromEncryptedStorage,
  removeItemFromEncryptedStorage,
  setItemInEncryptedStorage,
} from "@/utils/encrypted-storage";

import useLogout from "./use-logout";

const TIMEOUT_MS = 300000;

export default function useLogoutAfterInactivity() {
  const { t } = useTranslation();
  const auth = useAuthContext();
  const logoutUser = useLogout();
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const handleTimeLogic = async () => {
      const sessionTime = await getItemFromEncryptedStorage("backgroundTime");
      if (Math.abs(new Date().valueOf() - Number(sessionTime)) >= TIMEOUT_MS) {
        try {
          await logoutUser.mutateAsync();
        } catch (error) {}
        auth.logout(true);
        Alert.alert(t("Alerts.LogoutDueToInactivity"));
      }
      removeItemFromEncryptedStorage("backgroundTime");
    };

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      //We check for the app current state and we only want to handle case when app was previously in background mode
      if ((appState === "inactive" || appState === "background") && nextAppState === "active") {
        handleTimeLogic();
      } else if ((appState === "inactive" || appState === "active") && nextAppState === "background") {
        setItemInEncryptedStorage("backgroundTime", new Date().valueOf().toString());
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState, auth]);
}
