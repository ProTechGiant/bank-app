import noop from "lodash/noop";
import { createContext, useContext, useMemo, useState } from "react";

interface StatementContextState {
  setCorrelationId: (value: string) => void;
  correlationId: string | undefined;
}

const StatementContext = createContext<StatementContextState>({
  setCorrelationId: noop,
  correlationId: undefined,
});

function StatementContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Pick<StatementContextState, "correlationId">>({
    correlationId: undefined,
  });

  const setCorrelationId = (correlationId: string) => {
    setState(v => ({ ...v, correlationId }));
  };

  return (
    <StatementContext.Provider
      value={useMemo(
        () => ({
          ...state,

          setCorrelationId,
        }),
        [state]
      )}>
      {children}
    </StatementContext.Provider>
  );
}

const useStatementContext = () => useContext(StatementContext);

export { StatementContextProvider, useStatementContext };
