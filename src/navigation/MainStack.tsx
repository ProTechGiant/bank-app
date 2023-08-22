import { NavigationContainer } from "@react-navigation/native";

import { useAuthContext } from "@/contexts/AuthContext";
import { useDeepLinkHandler } from "@/hooks/use-deeplink-handler";
import { navigationRef } from "@/navigation/NavigationService";

import { AuthenticatedScreens } from "./AuthenticatedStack";
import { UnauthenticatedScreens } from "./UnAuthenticatedStack";

interface MainStackProps {
  onReady: () => void;
}

export default function MainStack({ onReady }: MainStackProps) {
  const { isAuthenticated } = useAuthContext();
  useDeepLinkHandler();

  return (
    <NavigationContainer onReady={onReady} ref={navigationRef}>
      {isAuthenticated ? <AuthenticatedScreens /> : <UnauthenticatedScreens />}
    </NavigationContainer>
  );
}
