import { useEffect, useState } from "react";
import { Alert, AppState, AppStateStatus } from "react-native";

import { useAuthContext } from "@/contexts/AuthContext";

const timeoutMs = 300000;

export default function useLogoutAfterInactivity() {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const auth = useAuthContext();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        auth.logout();
        Alert.alert("You have been logged out due to inactivity.");
      }, timeoutMs);
    };

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState === "inactive" || (appState === "background" && nextAppState === "active")) {
        resetTimeout();
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    resetTimeout();

    return () => {
      clearTimeout(timeout);
      subscription.remove();
    };
  }, [appState, auth]);
}
