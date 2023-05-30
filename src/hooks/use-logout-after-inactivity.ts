import { useEffect, useState } from "react";
import { Alert, AppState, AppStateStatus } from "react-native";
import EncryptedStorage from "react-native-encrypted-storage";

import { useAuthContext } from "@/contexts/AuthContext";

const TIMEOUT_MS = 300000;

export default function useLogoutAfterInactivity() {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const auth = useAuthContext();

  useEffect(() => {
    const handleTimeLogic = async () => {
      const sessionTime = await EncryptedStorage.getItem("backgroundTime");
      if (Math.abs(new Date().valueOf() - Number(sessionTime)) >= TIMEOUT_MS) {
        auth.logout();
        Alert.alert("You have been logged out due to inactivity.");
      }
      EncryptedStorage.removeItem("backgroundTime");
    };

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      //We check for the app current state and we only want to handle case when app was previously in background mode
      if ((appState === "inactive" || appState === "background") && nextAppState === "active") {
        handleTimeLogic();
      } else if ((appState === "inactive" || appState === "active") && nextAppState === "background") {
        EncryptedStorage.setItem("backgroundTime", new Date().valueOf().toString());
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState, auth]);
}
