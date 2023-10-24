import { createContext, useContext, useMemo, useState } from "react";

import { NI_ROOT_URL } from "../constants";
function noop() {
  return;
}

interface NIConnectionProperties {
  rootUrl: string;
  token: string;
}

interface NiCardDetails {
  bankCode: string | undefined;
  cardIdentifierId: string | undefined;
  cardIdentifierType: string | undefined;
  connectionProperties: NIConnectionProperties | undefined;
}

interface TokenDetail {
  token: string;
  tokenCreationTime: string;
}

interface CardDetailsContextState {
  setNiCardDetails: (niCardDetails: {
    bankCode: string;
    cardIdentifierId: string;
    cardIdentifierType: string;
    connectionProperties: NIConnectionProperties;
  }) => void;
  niCardDetails: NiCardDetails;
  setTokenDetails: (TokenDetails: { token: string; tokenCreationTime: string }) => void;
  tokenDetails: TokenDetail;
  clearContext: () => void;
}

const CardDetailsContext = createContext<CardDetailsContextState>({
  setNiCardDetails: noop,
  niCardDetails: {
    cardIdentifierType: undefined,
    cardIdentifierId: undefined,
    bankCode: undefined,
    connectionProperties: undefined,
  },
  setTokenDetails: noop,
  tokenDetails: {
    token: "",
    tokenCreationTime: "",
  },
  clearContext: noop,
});

const INITIAL_STATE = {
  niCardDetails: {
    cardIdentifierType: "EXID",
    cardIdentifierId: "40545400192399314423", //cf8d8f57-9063-4322-910e-ff090387a429
    bankCode: "CROAT",
    connectionProperties: {
      rootUrl: NI_ROOT_URL,
      token: "",
    },
  },
  tokenDetails: {
    token: "",
    tokenCreationTime: "",
  },
};

function CardDetailsContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(INITIAL_STATE);
  const setNiCardDetails = (niCardDetails: NiCardDetails) => {
    setState(v => ({ ...v, niCardDetails }));
  };
  const setTokenDetails = (tokenDetail: TokenDetail) => {
    setState(v => ({ ...v, tokenDetail }));
  };

  const clearContext = () => {
    setState(INITIAL_STATE);
  };

  return (
    <CardDetailsContext.Provider
      value={useMemo(
        () => ({
          ...state,
          clearContext,
          setNiCardDetails,
          setTokenDetails,
        }),
        [state]
      )}>
      {children}
    </CardDetailsContext.Provider>
  );
}

const useCardDetailsContext = () => useContext(CardDetailsContext);

export { CardDetailsContextProvider, useCardDetailsContext };
