import { useQuery } from "react-query";

import api from "@/api";

import { useOnboardingContext } from "../../context/OnboardingContext";

export type Status = "COMPLETED" | "PENDING" | "DECLINED";

interface ApiOnboardingStatusResponse {
  OnboardingStatus: Status;
}

const acceptableTaskNames = [
  "WaitingEDDResult",
  "RetryCustomerScreening",
  "RetrieveValidationStatus",
  "RetryAccountCreation",
];

export default function useAccountStatus() {
  const { fetchLatestWorkflowTask, correlationId } = useOnboardingContext();

  return useQuery("AccountStatus", async () => {
    if (undefined === correlationId) throw new Error("Cannot fetch customers/status without `correlationId`");

    const workflowTask = await fetchLatestWorkflowTask();

    if (!workflowTask || !acceptableTaskNames.some(word => workflowTask.Name.includes(word))) {
      throw new Error("Available workflowTaskId is not applicable to customers/status");
    }

    return api<ApiOnboardingStatusResponse>("v1", "customers/status", "GET", undefined, undefined, {
      ["X-Workflow-Task-Id"]: workflowTask.Id,
      ["x-correlation-id"]: correlationId,
    });
  });
}
