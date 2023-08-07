import { createContext, useContext, useMemo, useState } from "react";

import { BillDetail, NavigationType } from "../types";

function noop() {
  return;
}

interface SadadBillPaymentContextState {
  setNavigationType: (value: NavigationType) => void;
  navigationType: NavigationType;
  setBillDetails: (billDetails: {
    category?: string;
    billIssuer?: string;
    accountNumber?: string;
    description?: string;
    otherBillAmount?: string;
  }) => void;
  billDetails: BillDetail;
  clearContext: () => void;
}

const SadadBillPaymentContext = createContext<SadadBillPaymentContextState>({
  setNavigationType: noop,
  navigationType: undefined,
  clearContext: noop,
  setBillDetails: noop,
  billDetails: {
    category: undefined,
    billIssuer: undefined,
    accountNumber: undefined,
    description: undefined,
    otherBillAmount: undefined,
  },
});

const INITIAL_STATE = {
  navigationType: undefined,
  billDetails: {
    category: undefined,
    billIssuer: undefined,
    accountNumber: undefined,
    description: undefined,
    otherBillAmount: undefined,
  },
};

function SadadBillPaymentContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Pick<SadadBillPaymentContextState, "navigationType">>(INITIAL_STATE);

  const setNavigationType = (navigationType: NavigationType) => {
    setState(v => ({ ...v, navigationType }));
  };

  const setBillDetails = (billDetails: BillDetail) => {
    setState(v => ({ ...v, billDetails }));
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
          setBillDetails,
        }),
        [state]
      )}>
      {children}
    </SadadBillPaymentContext.Provider>
  );
}

const useSadadBillPaymentContext = () => useContext(SadadBillPaymentContext);

export { SadadBillPaymentContextProvider, useSadadBillPaymentContext };
