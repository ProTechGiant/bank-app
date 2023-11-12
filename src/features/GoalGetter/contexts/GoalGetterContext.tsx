import { createContext, useContext, useMemo, useState } from "react";

import { GoalGetterContextState, GoalGetterStateType } from "../types";

const GoalGetterContext = createContext<GoalGetterContextState>({} as GoalGetterContextState);

const initialState: GoalGetterStateType = {
  GoalName: "goalTest",
  ProductName: "",
  TargetAmount: 5000,
  MonthlyContribution: 5000,
  InitialContribution: 5000,
  TargetDate: "2023-11-05T16:34:01.092Z",
  RiskId: 1,
  ProductId: 1,
  GoalImage: "",
  UploadGoalImage: "",
  RecurringContribution: undefined,
  RecurringAmount: 0,
  RecurringFrequency: "Monthly",
  RecurringDate: "",
  ContributionMethod: "Recurring",
  Duration: undefined,
  //TODO check the type values
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
