import { createContext, useContext, useMemo, useState } from "react";

import { GoalGetterContextState, GoalGetterStateType } from "../types";

const GoalGetterContext = createContext<GoalGetterContextState>({} as GoalGetterContextState);

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
