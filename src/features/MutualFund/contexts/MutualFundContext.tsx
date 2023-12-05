import { createContext, useContext, useMemo, useState } from "react";

import { MutualFundContextState, MutualFundState, MutualFundStateType } from "../types";

const MutualFundContext = createContext<MutualFundContextState>({} as MutualFundState);

const initialState: MutualFundStateType = {
  CustomerId: "",
  CustomerPortfolioNumber: "",
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
