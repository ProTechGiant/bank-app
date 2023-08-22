import { createContext, useContext, useMemo, useState } from "react";

import { BillDetail, Biller, BillerCategory, NavigationType } from "../types";

function noop() {
  return;
}

interface SadadBillPaymentContextState {
  setNavigationType: (value: NavigationType) => void;
  navigationType: NavigationType;
  setBillDetails: (billDetails: {
    Category?: BillerCategory;
    BillIssuer?: Biller;
    AccountNumber?: string;
    Description?: string;
    OtherBillAmount?: string;
    BillingAccount?: string;
    BillNumber?: string;
    BillAmount?: string;
    BillAmountCurrency?: string;
    BillerNumber?: string;
    BillStatusCode?: string;
    DueDate?: string;
    ExactPaymentRequired?: boolean;
    IsAdvancePaymentAllowed?: boolean;
    IsOverPaymentAllowed?: boolean;
    IsPartialPaymentAllowed?: boolean;
    PaidAmount?: string;
    PaidAmountCurrency?: string;
    ServiceType?: string;
    BillDescriptionList?: string;
    PaymentRangesUpper?: string;
    PaymentRangesLower?: string;
    BillCategory?: string;
    BillType?: string;
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
    Category: undefined,
    BillIssuer: undefined,
    AccountNumber: undefined,
    Description: undefined,
    OtherBillAmount: undefined,
    BillID: undefined,
    BillingAccount: undefined,
    BillNumber: undefined,
    BillAmount: undefined,
    BillAmountCurrency: undefined,
    BillerNumber: undefined,
    BillStatusCode: undefined,
    DueDate: undefined,
    ExactPaymentRequired: undefined,
    IsAdvancePaymentAllowed: undefined,
    IsOverPaymentAllowed: undefined,
    IsPartialPaymentAllowed: undefined,
    PaidAmount: undefined,
    PaidAmountCurrency: undefined,
    ServiceType: undefined,
    BillDescriptionList: undefined,
    PaymentRangesUpper: undefined,
    PaymentRangesLower: undefined,
    BillCategory: undefined,
    BillType: undefined,
  },
});

const INITIAL_STATE = {
  navigationType: undefined,
  billDetails: {
    Category: undefined,
    BillIssuer: undefined,
    AccountNumber: undefined,
    Description: undefined,
    OtherBillAmount: undefined,
    BillNumber: undefined,
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
