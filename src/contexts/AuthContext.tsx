import { API_TOKEN } from "@env";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { setAuthenticationHeaders } from "@/api/send-api-request";

interface AuthContextProps {
  authenticate: (userId: string) => void;
  isAuthenticated: boolean;
  apiKey: string | undefined;
  userId: string | undefined;
}

function noop() {
  return;
}

const AuthContext = createContext<AuthContextProps>({
  authenticate: noop,
  isAuthenticated: false,
  apiKey: undefined,
  userId: undefined,
});

export function AuthContextProvider({ children }: React.PropsWithChildren) {
  const [state, setState] = useState<Omit<AuthContextProps, "authenticate">>({
    isAuthenticated: false,
    apiKey: API_TOKEN,
    userId: "301",
  });

  // temporary: set initial headers
  useEffect(() => {
    setAuthenticationHeaders({
      ["UserId"]: state.userId as string,
      ["X-Api-Key"]: state.apiKey as string,
    });
  }, []);

  const handleOnAuthenticate = (userId: string) => {
    setState({ userId, isAuthenticated: true, apiKey: state.apiKey });

    setAuthenticationHeaders({
      ["UserId"]: userId,
      ["X-Api-Key"]: state.apiKey as string,
    });
  };

  const contextValue = useMemo(() => ({ ...state, authenticate: handleOnAuthenticate }), [state]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
