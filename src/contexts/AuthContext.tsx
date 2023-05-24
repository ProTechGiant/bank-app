import { API_TOKEN } from "@env";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import EncryptedStorage from "react-native-encrypted-storage";

import { setAuthenticationHeaders } from "@/api/send-api-request";
import { generateRandomId } from "@/utils";

interface AuthContextProps {
  authenticate: (userId: string) => void;
  isAuthenticated: boolean;
  apiKey: string | undefined;
  userId: string | undefined;
  logout: () => void;
}

function noop() {
  return;
}
const AuthContext = createContext<AuthContextProps>({
  authenticate: noop,
  isAuthenticated: false,
  apiKey: undefined,
  userId: undefined,
  logout: () => noop,
});

export function AuthContextProvider({ children }: React.PropsWithChildren) {
  const [state, setState] = useState<Omit<AuthContextProps, "authenticate" | "logout">>({
    isAuthenticated: false,
    apiKey: API_TOKEN,
    //TODO: will update it when the signin flow is updated
    userId: "500",
  });

  // temporary: set initial headers
  useEffect(() => {
    setAuthenticationHeaders({
      ["UserId"]: state.userId as string,
      ["X-Api-Key"]: state.apiKey as string,
    });
  }, []);

  const handleOnLogout = () => {
    setState({ userId: undefined, isAuthenticated: false, apiKey: undefined });
    setAuthenticationHeaders({
      ["UserId"]: "",
      ["X-Api-Key"]: "",
    });
    EncryptedStorage.setItem("user", "");
  };

  const handleOnAuthenticate = (userId: string) => {
    setState({ userId, isAuthenticated: true, apiKey: state.apiKey });
    setAuthenticationHeaders({
      ["UserId"]: userId,
      ["X-Api-Key"]: state.apiKey as string,
    });
  };
  const contextValue = useMemo(
    () => ({ ...state, authenticate: handleOnAuthenticate, logout: handleOnLogout }),
    [state]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
