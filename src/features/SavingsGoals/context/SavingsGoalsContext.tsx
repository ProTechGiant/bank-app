import { createContext, useContext, useMemo, useState } from "react";

function noop() {
  return;
}

interface SavingsGoalsContextState {
  setSavingsPotId: (value: string) => void;
  savingsPotId: string | undefined;
}

const SavingsGoalsContext = createContext<SavingsGoalsContextState>({
  setSavingsPotId: noop,
  savingsPotId: undefined,
});

function SavingsGoalsContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Pick<SavingsGoalsContextState, "savingsPotId">>({
    savingsPotId: undefined,
  });

  const setSavingsPotId = (savingsPotId: string) => {
    setState(v => ({ ...v, savingsPotId }));
  };

  return (
    <SavingsGoalsContext.Provider
      value={useMemo(
        () => ({
          ...state,
          setSavingsPotId,
        }),
        [state]
      )}>
      {children}
    </SavingsGoalsContext.Provider>
  );
}

const useSavingsGoalsContext = () => useContext(SavingsGoalsContext);

export { SavingsGoalsContextProvider, useSavingsGoalsContext };
