import { createContext, useContext, useMemo, useState } from "react";

import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

import useOnboardingInstance from "../hooks/use-onboarding-instance";
import useOnboardingTasks from "../hooks/use-onboarding-tasks";

function noop() {
  return;
}

interface OnboardingContextState {
  setNationalId: (value: string) => void;
  nationalId: string | undefined;
  setCorrelationId: (value: string) => void;
  correlationId: string | undefined;
  setProcessId: (value: string) => void;
  processId: string | undefined;
  startOnboardingAsync: () => Promise<void>;
  fetchLatestWorkflowTask: () => Promise<{ Id: string; Name: string } | undefined>;
}

const OnboardingContext = createContext<OnboardingContextState>({
  setNationalId: noop,
  nationalId: undefined,
  setCorrelationId: noop,
  correlationId: undefined,
  setProcessId: noop,
  processId: undefined,
  startOnboardingAsync: () => Promise.reject(),
  fetchLatestWorkflowTask: () => Promise.reject(),
});

function OnboardingContextProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthContext();
  const onboardingInstanceAsync = useOnboardingInstance();
  const onboardingTasksAsync = useOnboardingTasks();

  const [state, setState] = useState<Pick<OnboardingContextState, "nationalId" | "correlationId" | "processId">>({
    nationalId: undefined,
    correlationId: undefined,
    processId: undefined,
  });

  const setNationalId = (nationalId: string) => {
    setState(v => ({ ...v, nationalId }));
  };

  const setCorrelationId = (correlationId: string) => {
    setState(v => ({ ...v, correlationId }));
  };

  const setProcessId = (processId: string) => {
    setState(v => ({ ...v, processId }));
  };

  const fetchLatestWorkflowTask = async () => {
    const { correlationId } = state;
    if (!correlationId) throw new Error("Cannot fetch tasks without `correlationId`");

    const response = await onboardingTasksAsync.mutateAsync({ correlationId });
    return response.Tasks?.[0] ?? undefined;
  };

  const startOnboardingAsync = async () => {
    const _userId = generateRandomId();
    auth.authenticate(_userId);

    const _correlationId = generateRandomId();
    const processId = await onboardingInstanceAsync.mutateAsync({ correlationId: _correlationId });

    setCorrelationId(_correlationId);
    setProcessId(String(processId));
  };

  return (
    <OnboardingContext.Provider
      value={useMemo(
        () => ({
          ...state,
          setNationalId,
          setCorrelationId,
          setProcessId,
          startOnboardingAsync,
          fetchLatestWorkflowTask,
        }),
        [state]
      )}>
      {children}
    </OnboardingContext.Provider>
  );
}

const useOnboardingContext = () => useContext(OnboardingContext);

export { OnboardingContextProvider, useOnboardingContext };
