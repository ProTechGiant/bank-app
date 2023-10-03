import { createContext, useContext, useMemo, useState } from "react";

import { GoalGetterContextState, GoalGetterStateType, Product } from "../types";

const GoalGetterContext = createContext<GoalGetterContextState>({} as GoalGetterContextState);

const initialProduct: Product = {
  ProductName: "",
  ProductType: "SAVING_POT",
  ProductRisk: "",
  ProductColor: "",
  ProductRiskColor: "",
  Duration: 0,
  UnitOfMeasurement: "Grams",
  MonthlyContribution: undefined,
  MinimumInitial: undefined,
  MinimumMonthly: undefined,
  MinimumContribution: undefined,
  Description: "",
  Availability: "Y",
  Rating: "",
  FetchStatus: "SUCCESS",
  ProductId: 0,
};

const initialState: GoalGetterStateType = {
  predefinedGoalId: 0,
  predefinedGoalName: "",
  predefinedGoalDefaultImage: undefined,
  goalImage: "",
  goalName: "",
  targetAmount: 0,
  targetDate: undefined,
  riskId: 0,
  productId: undefined,
  initialContribution: 0,
  monthlyContribution: undefined,
  recurringDay: undefined,
  productUnitOfMeasurement: undefined,
  roundUP: "N",
  startDate: undefined,
  AvailableContribution: 0,
  RecommendedMonthlyContribution: 0,
  product: initialProduct,
};

function GoalGetterContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState);

  const setGoalContextState = (newState: Partial<GoalGetterContextState>) => {
    setState(prevState => ({
      ...prevState,
      ...newState,
    }));
  };

  const resetGoalContextState = () => {
    setState(initialState);
  };

  return (
    <GoalGetterContext.Provider
      value={useMemo(() => ({ ...state, setGoalContextState, resetGoalContextState }), [state])}>
      {children}
    </GoalGetterContext.Provider>
  );
}

const useGoalGetterContext = () => useContext(GoalGetterContext);

export { GoalGetterContextProvider, useGoalGetterContext };
