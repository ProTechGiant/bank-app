import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import UserInactivity from "react-native-user-inactivity";

import { useAuthContext } from "@/contexts/AuthContext";
import { useDeepLinkHandler } from "@/hooks/use-deeplink-handler";
import { navigationRef } from "@/navigation/NavigationService";

import { AuthenticatedScreens } from "./AuthenticatedStack";
import { UnauthenticatedScreens } from "./UnAuthenticatedStack";
interface MainStackProps {
  onReady: () => void;
}
const TIMEOUT_MS = 300000; // 5 minutes

export default function MainStack({ onReady }: MainStackProps) {
  const { isAuthenticated, logout } = useAuthContext();

  useDeepLinkHandler();
  return (
    <NavigationContainer onReady={onReady} ref={navigationRef}>
      {isAuthenticated ? (
        <UserInactivity
          isActive={true}
          timeForInactivity={TIMEOUT_MS}
          onAction={isActive => {
            if (!isActive) {
              logout(true);
            }
          }}
          style={styles.userInactivityContainer}>
          <AuthenticatedScreens />
        </UserInactivity>
      ) : (
        <UnauthenticatedScreens />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  userInactivityContainer: { flex: 1 },
});
