import { createContext, useContext, useMemo, useState } from "react";

import { GoalGetterContextState, GoalGetterStateType } from "../types";

const GoalGetterContext = createContext<GoalGetterContextState>({} as GoalGetterContextState);

const initialState: GoalGetterStateType = {
  GoalName: "",
  TargetAmount: undefined,
  MonthlyContribution: undefined,
  InitialContribution: undefined,
  TargetDate: undefined,
  RiskId: undefined,
  ProductId: undefined,
  GoalImage: undefined,
  UploadGoalImage: undefined,
  RecurringContribution: undefined,
  RecurringAmount: undefined,
  RecurringFrequency: undefined,
  RecurringDate: undefined,
  ContributionMethod: undefined,
  ProductType: undefined,
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
