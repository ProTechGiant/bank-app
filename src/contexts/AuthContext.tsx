import { API_TOKEN } from "@env";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { setAuthenticationHeaders } from "@/api/send-api-request";
import { USER_ID } from "@/constants";
import { getItemFromEncryptedStorage, removeItemFromEncryptedStorage } from "@/utils/encrypted-storage";

interface AuthContextProps {
  authenticate: (userId: string, authToken?: string) => void; // TODO: We will make "authToken" a required field once we begin implementing authentication based on the authToken.
  authenticateAnonymously: (userId: string, authToken?: string) => void;
  updatePhoneNumber: (value: string) => void;
  isAuthenticated: boolean;
  apiKey: string | undefined;
  phoneNumber: string | undefined;
  userId: string | undefined;
  authToken: string | undefined;
  setAuthToken: (value: string) => void;
  logout: (stillPersistTheRegisteredUser?: boolean) => void;
  isUserLocked: boolean;
  notificationsReadStatus: boolean;
  setNotificationsReadStatus: (value: boolean) => void; // TODO will be  called inside EventListener which fired based on user clicks on notification
}

function noop() {
  return;
}

const AuthContext = createContext<AuthContextProps>({
  authenticate: noop,
  authenticateAnonymously: noop,
  updatePhoneNumber: noop,
  isAuthenticated: false,
  apiKey: undefined,
  phoneNumber: undefined,
  userId: USER_ID,
  authToken: undefined,
  logout: () => noop,
  isUserLocked: false,
  setAuthToken: noop,
  notificationsReadStatus: false,
  setNotificationsReadStatus: noop,
});

export function AuthContextProvider({ children }: React.PropsWithChildren) {
  type State = Omit<
    AuthContextProps,
    "authenticate" | "logout" | "authenticateAnonymously" | "updatePhoneNumber" | "setAuthToken"
  >;

  const [state, setState] = useState<State>({
    isAuthenticated: false,
    apiKey: API_TOKEN,
    userId: USER_ID, //TODO: to be replaced with dynamic value from API.
    authToken: undefined,
    phoneNumber: undefined,
    isUserLocked: false,
  });

  useEffect(() => {
    async function main() {
      try {
        const persistedUser = await getItemFromEncryptedStorage("user");
        if (!persistedUser) return;

        const persistedUserObject = JSON.parse(persistedUser);
        if (persistedUserObject.phoneNumber) {
          handleOnUpdatePhoneNumber(persistedUserObject.MobileNumber);
        }
      } catch (error) {
        // ..
      }
    }

    async function getAuthenticationToken() {
      try {
        const authToken = await getItemFromEncryptedStorage("authToken");
        if (!authToken) return;

        setState(current => ({ ...current, authToken }));
      } catch (error) {
        // ..
      }
    }

    main();
    getAuthenticationToken();
  }, []);

  useEffect(() => {
    setAuthenticationHeaders({
      ["UserId"]: state.userId as string,
      ["X-Api-Key"]: state.apiKey as string,
      ["Authorization"]: "Bearer " + state.authToken,
    });
  }, [state.userId, state.apiKey, state.authToken]);

  const handleOnLogout = (stillPersistTheRegisteredUser = false) => {
    if (stillPersistTheRegisteredUser) {
      setState({ ...state, isUserLocked: true, isAuthenticated: false });
      return;
    }

    setState({
      userId: state.userId,
      isAuthenticated: false,
      apiKey: state.apiKey,
      authToken: undefined,
      phoneNumber: undefined,
      isUserLocked: false,
    });

    setAuthenticationHeaders({
      ["UserId"]: "",
      ["X-Api-Key"]: "",
    });

    removeItemFromEncryptedStorage("user");
    removeItemFromEncryptedStorage("authToken");
  };

  // TODO: This code will be removed when the onboarding and sign-in features are implemented.
  const handleOnAuthenticateAnonymously = (userId: string, authToken?: string) => {
    setState({ ...state, userId, authToken, isAuthenticated: false });

    setAuthenticationHeaders({
      ["UserId"]: userId,
      ["X-Api-Key"]: state.apiKey as string,
      ["Authorization"]: "Bearer " + authToken,
    });
  };

  const handleOnAuthenticate = (userId: string, authToken?: string) => {
    setState(current => ({
      ...current,
      authToken,
      userId,
      isAuthenticated: true,
      apiKey: state.apiKey,
      isUserLocked: false,
    }));

    setAuthenticationHeaders({
      ["UserId"]: userId,
      ["Authorization"]: "Bearer " + authToken,
      ["X-Api-Key"]: state.apiKey as string,
    });
  };

  const handleOnUpdatePhoneNumber = (phoneNumber: string) => {
    setState(current => ({ ...current, phoneNumber }));
  };

  const setAuthToken = (authToken: string) => {
    setState({ ...state, authToken });
  };

  const handleonNotificationRead = (status: boolean) => {
    setState({ ...state, notificationsReadStatus: status });
  };

  const contextValue = useMemo(
    () => ({
      ...state,
      authenticate: handleOnAuthenticate,
      logout: handleOnLogout,
      authenticateAnonymously: handleOnAuthenticateAnonymously,
      updatePhoneNumber: handleOnUpdatePhoneNumber,
      setAuthToken: setAuthToken,
      setNotificationsReadStatus: handleonNotificationRead,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
