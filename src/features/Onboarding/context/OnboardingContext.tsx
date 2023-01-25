import { createContext, useContext, useMemo, useState } from "react";

import { generateRandomId } from "@/utils";

import useOnboardingInstance from "../hooks/use-onboarding-instance";
import useOnboardingTasks from "../hooks/use-onboarding-tasks";

function noop() {
  return;
}

interface OnboardingContextState {
  setNationalId: (value: string) => void;
  nationalId: string | undefined;
  setUserId: (value: string) => void;
  userId: string | undefined;
  setCorrelationId: (value: string) => void;
  correlationId: string | undefined;
  startOnboardingAsync: () => Promise<void>;
  fetchLatestWorkflowTask: () => Promise<{ id: string; name: string } | undefined>;
}

const OnboardingContext = createContext<OnboardingContextState>({
  setNationalId: noop,
  nationalId: undefined,
  setUserId: noop,
  userId: undefined,
  setCorrelationId: noop,
  correlationId: undefined,
  startOnboardingAsync: () => Promise.reject(),
  fetchLatestWorkflowTask: () => Promise.reject(),
});

function OnboardingContextProvider({ children }: { children: React.ReactNode }) {
  const onboardingInstanceAsync = useOnboardingInstance();
  const onboardingTasksAsync = useOnboardingTasks();

  const [state, setState] = useState<Pick<OnboardingContextState, "nationalId" | "userId" | "correlationId">>({
    nationalId: undefined,
    userId: undefined,
    correlationId: undefined,
  });

  const setNationalId = (nationalId: string) => {
    setState(v => ({ ...v, nationalId }));
  };

  const setUserId = (userId: string) => {
    setState(v => ({ ...v, userId }));
  };

  const setCorrelationId = (correlationId: string) => {
    setState(v => ({ ...v, correlationId }));
  };

  const fetchLatestWorkflowTask = async () => {
    const { userId, correlationId } = state;
    if (!userId || !correlationId) throw new Error("Cannot fetch tasks without `userId` and `correlationId`");

    const response = await onboardingTasksAsync.mutateAsync({ userId, correlationId });
    return response.tasks?.[0] ?? undefined;
  };

  const startOnboardingAsync = async () => {
    const _userId = generateRandomId();
    const correlationId = await onboardingInstanceAsync.mutateAsync({ userId: _userId });

    setUserId(_userId);
    setCorrelationId(String(correlationId));
  };

  return (
    <OnboardingContext.Provider
      value={useMemo(
        () => ({
          ...state,
          setNationalId,
          setUserId,
          setCorrelationId,
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
