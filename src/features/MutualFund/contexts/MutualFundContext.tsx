import { createContext, useContext, useMemo, useState } from "react";

import { MutualFundContextState } from "../types";

const MutualFundContext = createContext<MutualFundContextState>({} as MutualFundContextState);

const initialState: Partial<MutualFundContextState> = {
  CustomerId: "",
  CustomerPortfolioNumber: "",
  productId: undefined,
  startingAmountValue: "",
  monthlyAmountValue: "",
  selectedPayment: "",
  accountNumber: undefined,
  consentKey: "",
  selectedDay: 28,
};

function MutualFundContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState);

  const setMutualFundContextState = (newState: Partial<MutualFundContextState>) => {
    setState(prevState => ({
      ...prevState,
      ...newState,
    }));
  };

  const resetMutualFundContextState = () => {
    setState(initialState);
  };

  return (
    <MutualFundContext.Provider
      value={useMemo(() => ({ ...state, setMutualFundContextState, resetMutualFundContextState }), [state])}>
      {children}
    </MutualFundContext.Provider>
  );
}

const useMutualFundContext = () => useContext(MutualFundContext);

export { MutualFundContextProvider, useMutualFundContext };
