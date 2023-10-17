import { API_TOKEN } from "@env";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { setAuthenticationHeaders } from "@/api/send-api-request";
import { USER_ID } from "@/constants";
import { getItemFromEncryptedStorage, removeItemFromEncryptedStorage } from "@/utils/encrypted-storage";

interface NavigationTargetType {
  stack: string;
  screen: string;
  params?: unknown;
  appWasClosed?: boolean;
}
interface AuthContextProps {
  authenticate: (userId: string, authToken?: string) => void; // TODO: We will make "authToken" a required field once we begin implementing authentication based on the authToken.
  authenticateAnonymously: (userId: string, authToken?: string) => void;
  updatePhoneNumber: (value: string) => void;
  isAuthenticated: boolean;
  apiKey: string | undefined;
  phoneNumber: string | undefined;
  userId: string | undefined;
  setUserId: (value: string) => void;
  authToken: string | undefined;
  setAuthToken: (value: string) => void;
  logout: (stillPersistTheRegisteredUser?: boolean) => void;
  isUserLocked: boolean;
  notificationsReadStatus: boolean;
  navigationTarget: NavigationTargetType | null;
  updateNavigationTarget: (value: NavigationTargetType) => void;
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
  setUserId: () => noop,
  setAuthToken: noop,
  notificationsReadStatus: true,
  setNotificationsReadStatus: noop,
  updateNavigationTarget: noop,
  navigationTarget: null,
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
    notificationsReadStatus: true,
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
      ["userId"]: state.userId as string,
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
      notificationsReadStatus: true,
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

  const setUserId = (userId: string) => {
    setState({ ...state, userId });
  };

  const handleonNotificationRead = (status: boolean) => {
    setState({ ...state, notificationsReadStatus: status });
  };

  const updateNavigationTargetHandler = (navigationTarget: NavigationTargetType | null) => {
    setState({ ...state, navigationTarget: navigationTarget });
  };

  const contextValue = useMemo(
    () => ({
      ...state,
      authenticate: handleOnAuthenticate,
      logout: handleOnLogout,
      authenticateAnonymously: handleOnAuthenticateAnonymously,
      updatePhoneNumber: handleOnUpdatePhoneNumber,
      setAuthToken: setAuthToken,
      setUserId: setUserId,
      setNotificationsReadStatus: handleonNotificationRead,
      updateNavigationTarget: updateNavigationTargetHandler,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
