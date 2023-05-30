import { API_TOKEN } from "@env";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import EncryptedStorage from "react-native-encrypted-storage";

import { setAuthenticationHeaders } from "@/api/send-api-request";

interface AuthContextProps {
  authenticate: (userId: string) => void;
  isAuthenticated: boolean;
  apiKey: string | undefined;
  userId: string | undefined;
  logout: () => void;
  authenticateAnonymously: (userId: string) => void;
}

function noop() {
  return;
}

const AuthContext = createContext<AuthContextProps>({
  authenticate: noop,
  isAuthenticated: false,
  apiKey: undefined,
  userId: undefined,
  logout: noop,
  authenticateAnonymously: noop,
});

export function AuthContextProvider({ children }: React.PropsWithChildren) {
  const [state, setState] = useState<Omit<AuthContextProps, "authenticate" | "logout" | "authenticateAnonymously">>({
    isAuthenticated: false,
    apiKey: API_TOKEN,
    //TODO: will update it when the signin flow is updated
    userId: "301",
  });

  useEffect(() => {
    setAuthenticationHeaders({
      ["UserId"]: state.userId as string,
      ["X-Api-Key"]: state.apiKey as string,
    });
  }, [state.userId, state.apiKey]);

  const handleOnLogout = () => {
    setState({ userId: undefined, isAuthenticated: false, apiKey: undefined });
    setAuthenticationHeaders({
      ["UserId"]: "",
      ["X-Api-Key"]: "",
    });
    EncryptedStorage.setItem("user", "");
  };

  // TODO: This code will be removed when the onboarding and sign-in features are implemented.
  const authenticateAnonymously = (userId: string) => {
    setState({ ...state, userId });
    setAuthenticationHeaders({
      ["UserId"]: userId,
      ["X-Api-Key"]: state.apiKey as string,
    });
  };

  const handleOnAuthenticate = (userId: string) => {
    //TODO: Use API_TOKEN as default for temporary landing screen
    setState({
      userId,
      isAuthenticated: true,
      apiKey: API_TOKEN,
    });

    //TODO: Use API_TOKEN as default for temporary landing screen
    setAuthenticationHeaders({
      ["UserId"]: userId,
      ["X-Api-Key"]: API_TOKEN,
    });
  };

  const contextValue = useMemo(
    () => ({ ...state, authenticate: handleOnAuthenticate, logout: handleOnLogout, authenticateAnonymously }),
    [state]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
