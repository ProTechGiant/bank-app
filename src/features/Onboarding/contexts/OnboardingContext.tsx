import { createContext, useContext, useMemo, useState } from "react";

import api from "@/api";

import { useOnboardingInstance, useOnboardingRevertTask, useOnboardingTasks } from "../hooks/context-hooks";
import { AddressInterface, FobEligibilityRequest, FobEligibilityResponse, Status } from "../types";

function noop() {
  return;
}

interface OnboardingContextState {
  setNationalId: (value: string) => void;
  setCustomerName: (value: string) => void;
  nationalId: string | undefined;
  userName: string | undefined;
  addressData: undefined | AddressInterface;
  setTransactionId: (value: string) => void;
  transactionId: string | undefined;
  setMobileNumber: (value: string) => void;
  setFobMobileNumber: (value: string) => void;
  setAddressData: (value: object) => void;
  setIsLoading: (value: boolean) => void;
  mobileNumber: string | undefined;
  fobMobileNumber: string | undefined;
  isLoading: boolean;
  setCorrelationId: (value: string) => void;
  correlationId: string | undefined;
  setCurrentTask: (currentTask: { Id: string; Name: string }) => void;
  currentTask: { Id: string; Name: string } | undefined;
  startOnboardingAsync: (NationalId: string, MobileNumber: string) => Promise<{ Status: Status; TempUserId: string }>;
  fetchLatestWorkflowTask: () => Promise<{ Id: string; Name: string } | undefined>;
  revertWorkflowTask: (WorkflowTask: { Id: string; Name: string }) => Promise<void>;
  checkFobEligibility: (
    body: FobEligibilityRequest,
    currentTask: { Id: string; Name: string },
    lang: string
  ) => Promise<FobEligibilityResponse>;
}

const OnboardingContext = createContext<OnboardingContextState>({
  setNationalId: noop,
  setTransactionId: noop,
  setCustomerName: noop,
  userName: undefined,
  nationalId: undefined,
  transactionId: undefined,
  setMobileNumber: noop,
  setFobMobileNumber: noop,
  mobileNumber: undefined,
  fobMobileNumber: undefined,
  isLoading: false,
  setCorrelationId: noop,
  setAddressData: noop,
  setIsLoading: noop,
  correlationId: undefined,
  setCurrentTask: noop,
  addressData: undefined,
  currentTask: undefined,
  startOnboardingAsync: () => Promise.reject(),
  fetchLatestWorkflowTask: () => Promise.reject(),
  revertWorkflowTask: () => Promise.reject(),
  checkFobEligibility: () => Promise.reject(),
});

function OnboardingContextProvider({ children }: { children: React.ReactNode }) {
  const onboardingInstanceAsync = useOnboardingInstance();
  const onboardingTasksAsync = useOnboardingTasks();
  const onboardingRevertTaskAsync = useOnboardingRevertTask();

  const [state, setState] = useState<
    Pick<
      OnboardingContextState,
      | "nationalId"
      | "correlationId"
      | "currentTask"
      | "transactionId"
      | "userName"
      | "mobileNumber"
      | "fobMobileNumber"
      | "addressData"
    >
  >({
    nationalId: undefined,
    correlationId: undefined,
    currentTask: undefined,
    transactionId: undefined,
    userName: undefined,
    mobileNumber: undefined,
    fobMobileNumber: undefined,
    addressData: undefined,
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
  const setMobileNumber = (mobileNumber: string) => {
    setState(v => ({ ...v, mobileNumber }));
  };

  const setFobMobileNumber = (fobMobileNumber: string) => {
    setState(v => ({ ...v, fobMobileNumber }));
  };

  const setIsLoading = (isLoading: boolean) => {
    setState(v => ({ ...v, isLoading }));
  };

  const setCorrelationId = (correlationId: string) => {
    setState(v => ({ ...v, correlationId }));
  };

  const setCurrentTask = (currentTask: { Id: string; Name: string }) => {
    setState(v => ({ ...v, currentTask }));
  };

  const setAddressData = (address: AddressInterface) => {
    setState(v => ({ ...v, addressData: address }));
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

  const checkFobEligibility = async (
    body: FobEligibilityRequest,
    currentTask: { Id: string; Name: string },
    lang: string
  ) => {
    const { correlationId } = state;
    if (!correlationId) throw new Error("Cannot start Onboarding without `correlationId`");
    return api<FobEligibilityResponse>("v1", "customers/fob/eligibility", "POST", undefined, body, {
      ["x-correlation-id"]: correlationId,
      ["X-Workflow-Task-Id"]: currentTask.Id,
      ["Accept-Language"]: lang,
    });
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
          setMobileNumber,
          setIsLoading,
          checkFobEligibility,
          setFobMobileNumber,
          setAddressData,
        }),
        [state]
      )}>
      {children}
    </OnboardingContext.Provider>
  );
}

const useOnboardingContext = () => useContext(OnboardingContext);

export { OnboardingContextProvider, useOnboardingContext };
