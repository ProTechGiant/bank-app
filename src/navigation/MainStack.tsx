import { NavigationContainer } from "@react-navigation/native";

import { useAuthContext } from "@/contexts/AuthContext";

import { AuthenticatedScreens } from "./AuthenticatedStack";
import { UnauthenticatedScreens } from "./UnAuthenticatedStack";

interface MainStackProps {
  onReady: () => void;
}

export default function MainStack({ onReady }: MainStackProps) {
  const { isAuthenticated } = useAuthContext();

  return (
    <NavigationContainer onReady={onReady}>
      {isAuthenticated ? <AuthenticatedScreens /> : <UnauthenticatedScreens />}
    </NavigationContainer>
  );
}
