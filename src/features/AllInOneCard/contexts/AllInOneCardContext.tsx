import { createContext, useContext, useMemo, useState } from "react";

import { AllInOneCardContextState, Screens } from "../types";

const AllInOneCardContext = createContext<AllInOneCardContextState>({} as AllInOneCardContextState);

const initialState: AllInOneCardContextState = {
  cardType: undefined,
  cardStatus: undefined,
  productId: "",
  paymentPlan: undefined,
  paymentPlanId: undefined,
  paymentPlanCode: undefined,
  redemptionMethod: undefined,
  redemptionMethodId: undefined,
  physicalCardStatus: false,
  productCode: "",
};

function AllInOneCardContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState);

  const setContextState = (newState: Partial<AllInOneCardContextState>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  };

  const resetState = () => {
    setState(initialState);
  };

  const setScreen = (screen: Screens) => setContextState({ currentScreen: screen });

  return (
    <AllInOneCardContext.Provider
      // eslint-disable-next-line react-hooks/exhaustive-deps
      value={useMemo(() => ({ ...state, setContextState, resetState, setScreen }), [state])}>
      {children}
    </AllInOneCardContext.Provider>
  );
}

const useAllInOneCardContext = () => useContext(AllInOneCardContext);
export { AllInOneCardContextProvider, useAllInOneCardContext };
