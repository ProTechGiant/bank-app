/**
 * UPDATE FILE ONCE BE IS FINISHED
 */

import { useMutation } from "react-query";

import api from "@/api";

import { useOnboardingContext } from "../../context/OnboardingContext";

export default function useTermsConditions() {
  const { fetchLatestWorkflowTask, correlationId } = useOnboardingContext();

  return useMutation(async () => {
    if (undefined === correlationId) throw new Error("Cannot fetch customers/terms-conditions without `correlationId`");

    const workflowTask = await fetchLatestWorkflowTask();
    if (!workflowTask || workflowTask.Name !== "T&C")
      throw new Error("Available workflowTaskId is not applicable to customers/terms-conditions");

    return api<string>(
      "v1",
      "customers/terms-conditions",
      "POST",
      undefined,
      {
        TermsAndConditionsFlag: true,
        TermsAndConditionsVersionNumber: "1.0",
        DeclarationsFlag: true,
        DeclarationsVersionNumber: "1.0",
      },
      {
        ["X-Workflow-Task-Id"]: workflowTask.Id,
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}
