import { useMutation } from "react-query";

import api from "@/api";

import { useOnboardingContext } from "../../context/OnboardingContext";
import ApiOnboardingError from "../../types/ApiOnboardingError";
import FinancialDetails from "./FinancialDetails";

export default function useSubmitFinancialDetails() {
  const { fetchLatestWorkflowTask, userId, correlationId } = useOnboardingContext();

  return useMutation(async (values: FinancialDetails) => {
    if (!userId || !correlationId) throw new Error("Need valid `userId` and `correlationId` to be available");

    const workflowTask = await fetchLatestWorkflowTask();
    if (!workflowTask || workflowTask.Name !== "PersistFinancialInfo")
      throw new Error("Available workflowTaskId is not applicable to customers/financial/details");

    return api<string, ApiOnboardingError>(
      "api-dev",
      "v1",
      "customers/financial/details",
      "POST",
      undefined,
      { ...values },
      {
        ["X-Workflow-Task-Id"]: workflowTask.Id,
        ["UserId"]: userId,
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}
