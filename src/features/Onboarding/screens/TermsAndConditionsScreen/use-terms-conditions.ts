/**
 * UPDATE FILE ONCE BE IS FINISHED
 */

import { useMutation } from "react-query";

import api from "@/api";

import { useOnboardingContext } from "../../context/OnboardingContext";
import ApiOnboardingError from "../../types/ApiOnboardingError";

export default function useTermsConditions() {
  const { fetchLatestWorkflowTask, userId, correlationId } = useOnboardingContext();

  return useMutation(async () => {
    if (undefined === userId || undefined === correlationId)
      throw new Error("Cannot fetch customers/terms-conditions without `userId` and `correlationId`");

    const workflowTask = await fetchLatestWorkflowTask();
    if (!workflowTask || workflowTask.name !== "Terms")
      throw new Error("Available workflowTaskId is not applicable to customers/terms-conditions");

    return api<string, ApiOnboardingError>(
      "api-dev",
      "v1",
      "customers/terms-conditions",
      "POST",
      undefined,
      {
        termsAndConditionsFlag: true,
        termsAndConditionsVersionNumber: "1.0",
        declarationsFlag: true,
        declarationsVersionNumber: "1.0",
      },
      {
        ["userId"]: userId,
        ["X-Workflow-Task-Id"]: workflowTask.id,
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}
