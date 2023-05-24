import { createContext, useContext, useMemo, useState } from "react";

import { useOnboardingInstance, useOnboardingRevertTask, useOnboardingTasks } from "../hooks/context-hooks";

function noop() {
  return;
}

interface OnboardingContextState {
  setNationalId: (value: string) => void;
  setCustomerName: (value: string | undefined) => void;
  nationalId: string | undefined;
  userName: string | undefined;
  setTransactionId: (value: string) => void;
  transactionId: string | undefined;
  setCorrelationId: (value: string) => void;
  correlationId: string | undefined;
  setCurrentTask: (currentTask: { Id: string; Name: string }) => void;
  currentTask: { Id: string; Name: string } | undefined;
  startOnboardingAsync: (NationalId: string, MobileNumber: string) => Promise<void>;
  fetchLatestWorkflowTask: () => Promise<{ Id: string; Name: string } | undefined>;
  revertWorkflowTask: (WorkflowTask: { Id: string; Name: string }) => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextState>({
  setNationalId: noop,
  setTransactionId: noop,
  setCustomerName: noop,
  userName: undefined,
  nationalId: undefined,
  transactionId: undefined,
  setCorrelationId: noop,
  correlationId: undefined,
  setCurrentTask: noop,
  currentTask: undefined,
  startOnboardingAsync: () => Promise.reject(),
  fetchLatestWorkflowTask: () => Promise.reject(),
  revertWorkflowTask: () => Promise.reject(),
});

function OnboardingContextProvider({ children }: { children: React.ReactNode }) {
  const onboardingInstanceAsync = useOnboardingInstance();
  const onboardingTasksAsync = useOnboardingTasks();
  const onboardingRevertTaskAsync = useOnboardingRevertTask();

  const [state, setState] = useState<
    Pick<OnboardingContextState, "nationalId" | "correlationId" | "currentTask" | "transactionId" | "userName">
  >({
    nationalId: undefined,
    correlationId: undefined,
    currentTask: undefined,
    transactionId: undefined,
    userName: undefined,
  });

  const setNationalId = (nationalId: string) => {
    setState(v => ({ ...v, nationalId }));
  };

  const setTransactionId = (transactionId: string) => {
    setState(v => ({ ...v, transactionId }));
  };

  const setCustomerName = (userName: string) => {
    setState(v => ({ ...v, userName }));
  };

  const setCorrelationId = (correlationId: string) => {
    setState(v => ({ ...v, correlationId }));
  };

  const setCurrentTask = (currentTask: { Id: string; Name: string }) => {
    setState(v => ({ ...v, currentTask }));
  };

  const fetchLatestWorkflowTask = async () => {
    const { correlationId } = state;
    if (!correlationId) throw new Error("Cannot fetch tasks without `correlationId`");

    const response = await onboardingTasksAsync.mutateAsync({ correlationId });
    const _currentTask = response.Tasks?.[0] ?? undefined;
    setCurrentTask(_currentTask);
    return _currentTask;
  };

  const revertWorkflowTask = async (WorkflowTask: { Id: string; Name: string }) => {
    const { correlationId } = state;
    if (!correlationId) throw new Error("Cannot revert task without `correlationId`");

    const response = await onboardingRevertTaskAsync.mutateAsync({
      correlationId,
      WorkflowTask,
    });
    return response;
  };

  const startOnboardingAsync = async (NationalId: string, MobileNumber: string) => {
    const { correlationId } = state;
    if (!correlationId) throw new Error("Cannot start Onboarding without `correlationId`");

    const response = await onboardingInstanceAsync.mutateAsync({
      correlationId: correlationId,
      NationalId,
      MobileNumber,
    });
    return response;
  };

  return (
    <OnboardingContext.Provider
      value={useMemo(
        () => ({
          ...state,
          setNationalId,
          setCustomerName,
          setTransactionId,
          setCorrelationId,
          setCurrentTask,
          startOnboardingAsync,
          fetchLatestWorkflowTask,
          revertWorkflowTask,
        }),
        [state]
      )}>
      {children}
    </OnboardingContext.Provider>
  );
}

const useOnboardingContext = () => useContext(OnboardingContext);

export { OnboardingContextProvider, useOnboardingContext };
