import { createContext, useContext, useMemo, useState } from "react";

import { NavigationType } from "../types";

function noop() {
  return;
}

interface SadadBillPaymentContextState {
  setNavigationType: (value: NavigationType) => void;
  navigationType: NavigationType;
  clearContext: () => void;
}

const SadadBillPaymentContext = createContext<SadadBillPaymentContextState>({
  setNavigationType: noop,
  navigationType: undefined,
  clearContext: noop,
});

const INITIAL_STATE = {
  navigationType: undefined,
};

function SadadBillPaymentContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Pick<SadadBillPaymentContextState, "navigationType">>(INITIAL_STATE);

  const setNavigationType = (navigationType: NavigationType) => {
    setState(v => ({ ...v, navigationType }));
  };

  const clearContext = () => {
    setState(INITIAL_STATE);
  };

  return (
    <SadadBillPaymentContext.Provider
      value={useMemo(
        () => ({
          ...state,
          setNavigationType,
          clearContext,
        }),
        [state]
      )}>
      {children}
    </SadadBillPaymentContext.Provider>
  );
}

const useSadadBillPaymentContext = () => useContext(SadadBillPaymentContext);

export { SadadBillPaymentContextProvider, useSadadBillPaymentContext };
