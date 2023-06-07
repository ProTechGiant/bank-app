import { createContext, useContext, useMemo, useState } from "react";

import { SIGNIN_CORRELATION_ID } from "../constants";
import { useSignInInstance, useSignInRevertTask, useSignInTasks } from "../hooks/context-hooks";

function noop() {
  return;
}

interface SignInContextState {
  setNationalId: (value: string) => void;
  nationalId: string | undefined;
  mobileNumber: string | undefined;
  setSignInCorrelationId: (value: string) => void;
  correlationId: string | undefined;
  setCurrentTask: (currentTask: { Id: string; Name: string }) => void;
  currentTask: { Id: string; Name: string } | undefined;
  startSignInAsync: (NationalId: string, MobileNumber: string) => Promise<void>;
  fetchLatestWorkflowTask: () => Promise<{ Id: string; Name: string } | undefined>;
  revertWorkflowTask: (WorkflowTask: { Id: string; Name: string }) => Promise<void>;
  isPasscodeCreated: boolean;
  setIsPasscodeCreated: (isPasscodeCreated: boolean) => void;
}

const SignInContext = createContext<SignInContextState>({
  setNationalId: noop,
  nationalId: undefined,
  mobileNumber: undefined,
  setSignInCorrelationId: noop,
  correlationId: SIGNIN_CORRELATION_ID,
  setCurrentTask: noop,
  currentTask: undefined,
  startSignInAsync: () => Promise.reject(),
  fetchLatestWorkflowTask: () => Promise.reject(),
  revertWorkflowTask: () => Promise.reject(),
  isPasscodeCreated: true,
  setIsPasscodeCreated: noop,
});

function SignInContextProvider({ children }: { children: React.ReactNode }) {
  const SignInInstanceAsync = useSignInInstance();
  const SignInTasksAsync = useSignInTasks();
  const SignInRevertTaskAsync = useSignInRevertTask();

  const [state, setState] = useState<
    Pick<SignInContextState, "nationalId" | "correlationId" | "currentTask" | "isPasscodeCreated">
  >({
    nationalId: undefined,
    correlationId: undefined,
    currentTask: undefined,
    isPasscodeCreated: true,
  });

  const setNationalId = (nationalId: string) => {
    setState(v => ({ ...v, nationalId }));
  };

  const setIsPasscodeCreated = (isCreated: boolean) => {
    setState(v => ({ ...v, isPasscodeCreated: isCreated }));
  };

  const setSignInCorrelationId = (correlationId: string) => {
    setState(v => ({ ...v, correlationId }));
  };

  const setCurrentTask = (currentTask: { Id: string; Name: string }) => {
    setState(v => ({ ...v, currentTask }));
  };

  const fetchLatestWorkflowTask = async () => {
    const { correlationId } = state;
    if (!correlationId) throw new Error("Cannot fetch tasks without `signInCorrelationId`");

    const response = await SignInTasksAsync.mutateAsync({ correlationId });
    const _currentTask = response.Tasks?.[0] ?? undefined;
    setCurrentTask(_currentTask);
    return _currentTask;
  };

  const revertWorkflowTask = async (WorkflowTask: { Id: string; Name: string }) => {
    const { correlationId } = state;
    if (!correlationId) throw new Error("Cannot revert task without `signInCorrelationId`");

    const response = await SignInRevertTaskAsync.mutateAsync({
      correlationId,
      WorkflowTask,
    });
    return response;
  };

  const startSignInAsync = async (NationalId: string, MobileNumber: string) => {
    const { correlationId } = state;
    if (!correlationId) throw new Error("Cannot start SignIn without `signInCorrelationId`");

    const response = await SignInInstanceAsync.mutateAsync({
      correlationId: correlationId,
      NationalId,
      MobileNumber,
    });
    return response;
  };

  return (
    <SignInContext.Provider
      value={useMemo(
        () => ({
          ...state,
          setNationalId,
          setSignInCorrelationId,
          setCurrentTask,
          startSignInAsync,
          fetchLatestWorkflowTask,
          revertWorkflowTask,
          setIsPasscodeCreated,
        }),
        [state]
      )}>
      {children}
    </SignInContext.Provider>
  );
}

const useSignInContext = () => useContext(SignInContext);

export { SignInContextProvider, useSignInContext };
