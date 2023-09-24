import { createContext, useContext, useMemo, useState } from "react";

// TODO: check with BE team goal object type, maybe will be changed, for example roundUP to boolean
interface GoalGetterContextState {
  goalName: string;
  targetAmount: number;
  initialContribution: number;
  monthlyContribution?: number;
  recurringDay?: string;
  targetDate?: string;
  riskId?: number;
  productId?: string;
  roundUP: "Y" | "N";
  goalImage?: string;
  predefinedGoalId?: number;
  predefinedGoalDefaultImage?: string;
  startDate?: string;
  otpCode?: string;
  productUnitOfMeasurement?: "Grams" | "SAR";
  setGoalContextState: (newState: Partial<GoalGetterContextState>) => void;
  resetGoalContextState: () => void;
}

const GoalGetterContext = createContext<GoalGetterContextState>({} as GoalGetterContextState);

const initialState: Omit<GoalGetterContextState, "setGoalContextState" | "resetGoalContextState"> = {
  predefinedGoalId: undefined,
  predefinedGoalDefaultImage: undefined,
  goalImage: undefined,
  goalName: "",
  targetAmount: 0,
  targetDate: undefined,
  riskId: undefined,
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
