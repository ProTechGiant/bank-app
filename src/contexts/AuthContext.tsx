import { API_TOKEN } from "@env";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { setAuthenticationHeaders } from "@/api/send-api-request";
import {
  USER_WITH_ALL_IN_CARD,
  USER_WITH_ALL_IN_CARD_2,
  USER_WITH_INACTIVE_ALL_IN_CARD,
  USER_WITH_NERA_PLUS_CARD,
} from "@/features/AllInOneCard/mocks";
import { CardTypes, CurrenciesType } from "@/features/AllInOneCard/types";
import biometricsService from "@/services/biometrics/biometricService";
import { getItemFromEncryptedStorage, removeItemFromEncryptedStorage } from "@/utils/encrypted-storage";

//TODO : we are keeping some parameters for Aio card here for state as some apis are mocked which can not keep state. It should be removed when eveything is working with apis
interface AioCardProps {
  isConnectedToAppleWallet: boolean;
  aioCardId: string;
  isAioClosedPermanent: boolean;
  cardIdentifierType: string;
  accountNumber: string;
}

interface NavigationTargetType {
  stack: string;
  screen: string;
  params?: unknown;
  appWasClosed?: boolean;
}
interface AuthContextProps {
  authenticate: (userId: string, authToken: string) => void;
  updatePhoneNumber: (value: string) => void;
  isAuthenticated: boolean;
  apiKey: string | undefined;
  phoneNumber: string | undefined;
  userId: string | undefined;
  setUserId: (value: string) => void;
  authToken: string | undefined;
  setAuthToken: (value: string) => void;
  refreshToken: string | undefined;
  setRefreshToken: (value: string) => void;
  logout: (keepUser?: boolean) => void;
  isUserLocked: boolean;
  notificationsReadStatus: boolean;
  allInOneCardStatus: "active" | "inActive" | "none";
  setAllInOneCardStatus: (value: "active" | "inActive" | "none") => void;
  allInOneCardType: "nera" | "neraPlus";
  setAllInOneCardType: (value: "nera" | "neraPlus") => void;
  //TODO : only mocking at the moment . will be removed when we have actual way for checking if user have card or not
  myCurrencies: CurrenciesType[] | [];
  setMyCurrencies: (value: CurrenciesType[] | []) => void;
  navigationTarget: NavigationTargetType | null;
  updateNavigationTarget: (value: NavigationTargetType) => void;
  setNotificationsReadStatus: (value: boolean) => void; // TODO will be  called inside EventListener which fired based on user clicks on notification
  //TODO : only mocking at the moment . will be removed when we have actual way for checking if user have applied for physical card
  hasAppliedPhysicalCard: boolean;
  setApplyAioCardStatus: (hasApplied: boolean) => void;
  //TODO: only to keep state of card temporary as there are some mock api which do not keep state of card
  otherAioCardProperties: Partial<AioCardProps>;
  setOtherAioCardProperties: (props: Partial<AioCardProps>) => void;
}

function noop() {
  return;
}

const AuthContext = createContext<AuthContextProps>({
  authenticate: noop,
  updatePhoneNumber: noop,
  isAuthenticated: false,
  apiKey: undefined,
  phoneNumber: undefined,
  userId: undefined,
  authToken: undefined,
  refreshToken: undefined,
  logout: () => noop,
  isUserLocked: false,
  setUserId: () => noop,
  setAuthToken: noop,
  setRefreshToken: noop,
  notificationsReadStatus: true,
  setNotificationsReadStatus: noop,
  updateNavigationTarget: noop,
  navigationTarget: null,
  allInOneCardStatus: "none",
  setAllInOneCardStatus: noop,
  allInOneCardType: "nera",
  setAllInOneCardType: noop,
  myCurrencies: [],
  setMyCurrencies: noop,
  hasAppliedPhysicalCard: false,
  setApplyAioCardStatus: noop,
  otherAioCardProperties: { isConnectedToAppleWallet: false },
  setOtherAioCardProperties: noop,
});

export function AuthContextProvider({ children }: React.PropsWithChildren) {
  type State = Omit<
    AuthContextProps,
    | "authenticate"
    | "logout"
    | "updatePhoneNumber"
    | "setAuthToken"
    | "setAllInOneCardStatus"
    | "setAllInOneCardType"
    | "setMyCurrencies"
    | "setApplyAioCardStatus"
    | "setOtherAioCardProperties"
    | "setRefreshToken"
  >;

  const [state, setState] = useState<State>({
    isAuthenticated: false,
    apiKey: API_TOKEN,
    userId: undefined,
    authToken: undefined,
    refreshToken: undefined,
    phoneNumber: undefined,
    isUserLocked: false,
    notificationsReadStatus: true,
    allInOneCardStatus: "none",
    allInOneCardType: "nera",
    myCurrencies: [],
    hasAppliedPhysicalCard: false,
    otherAioCardProperties: { isConnectedToAppleWallet: false },
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

  const handleOnLogout = (keepUser = false) => {
    setState({
      userId: state.userId,
      isAuthenticated: false,
      apiKey: state.apiKey,
      authToken: undefined,
      refreshToken: undefined,
      phoneNumber: undefined,
      isUserLocked: false,
      notificationsReadStatus: true,
      allInOneCardStatus: "none",
      allInOneCardType: "nera",
      myCurrencies: [],
      hasAppliedPhysicalCard: false,
      otherAioCardProperties: { isConnectedToAppleWallet: false },
    });

    if (!keepUser) {
      removeItemFromEncryptedStorage("user");
      biometricsService.deleteKeys();
    }
    removeItemFromEncryptedStorage("authToken");
  };

  const handleOnAuthenticate = (userId: string, authToken?: string) => {
    setState(current => ({
      ...current,
      authToken,
      userId,
      isAuthenticated: true,
      apiKey: state.apiKey,
      isUserLocked: false,
      allInOneCardStatus: checkCardStatus(userId),
      allInOneCardType: checkCardType(userId),
    }));

    setAuthenticationHeaders({
      ["UserId"]: userId,
      ["Authorization"]: "Bearer " + authToken,
      ["X-Api-Key"]: state.apiKey as string,
    });
  };

  //TODO : only mocking at the moment . will be removed when we have actual way for checking if user have card or not
  const checkCardStatus = (userId: string): "active" | "inActive" | "none" => {
    if (userId === USER_WITH_INACTIVE_ALL_IN_CARD) {
      return "inActive";
    } else if (
      userId === USER_WITH_ALL_IN_CARD ||
      userId === USER_WITH_ALL_IN_CARD_2 ||
      userId === USER_WITH_NERA_PLUS_CARD
    ) {
      return "active";
    } else return "none";
  };

  //TODO : only mocking at the moment . will be removed when we have actual way for checking if user have card or not
  const checkCardType = (userId: string): CardTypes => {
    if (userId === USER_WITH_NERA_PLUS_CARD) {
      return CardTypes.NERA_PLUS;
    } else return CardTypes.NERA;
  };

  const handleOnUpdatePhoneNumber = (phoneNumber: string) => {
    setState(current => ({ ...current, phoneNumber }));
  };

  const setAuthToken = (authToken: string) => {
    setState({ ...state, authToken });
  };

  const setRefreshToken = (refreshToken: string) => {
    setState({ ...state, refreshToken });
  };

  const setAllInOneCardStatus = (allInOneCardStatus: "active" | "inActive" | "none") => {
    setState({ ...state, allInOneCardStatus });
  };

  const setAllInOneCardType = (allInOneCardType: "nera" | "neraPlus") => {
    setState({ ...state, allInOneCardType });
  };

  const setUserId = (userId: string) => {
    setState({ ...state, userId });
  };

  const handleonNotificationRead = (status: boolean) => {
    setState({ ...state, notificationsReadStatus: status });
  };

  const setMyCurrencies = (myCurrencies: CurrenciesType[] | []) => {
    setState({ ...state, myCurrencies });
  };

  const setApplyAioCardStatus = (hasApplied: boolean) => {
    setState({ ...state, hasAppliedPhysicalCard: hasApplied });
  };
  const setOtherAioCardProperties = (props: Partial<AioCardProps>) => {
    setState(prevState => ({
      ...prevState,
      otherAioCardProperties: { ...prevState.otherAioCardProperties, ...props },
    }));
  };

  const updateNavigationTargetHandler = (navigationTarget: NavigationTargetType | null) => {
    setState({ ...state, navigationTarget: navigationTarget });
  };

  const contextValue = useMemo(
    () => ({
      ...state,
      authenticate: handleOnAuthenticate,
      logout: handleOnLogout,
      updatePhoneNumber: handleOnUpdatePhoneNumber,
      setAuthToken: setAuthToken,
      setRefreshToken,
      setUserId: setUserId,
      setNotificationsReadStatus: handleonNotificationRead,
      updateNavigationTarget: updateNavigationTargetHandler,
      setAllInOneCardStatus: setAllInOneCardStatus,
      setAllInOneCardType: setAllInOneCardType,
      setMyCurrencies: setMyCurrencies,
      setApplyAioCardStatus: setApplyAioCardStatus,
      setOtherAioCardProperties: setOtherAioCardProperties,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
