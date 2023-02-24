import { useMutation } from "react-query";

import api from "@/api";

import { useOnboardingContext } from "../../context/OnboardingContext";
import FinancialDetails from "./FinancialDetails";

export default function useSubmitFinancialDetails() {
  const { fetchLatestWorkflowTask, correlationId } = useOnboardingContext();

  return useMutation(async (values: FinancialDetails) => {
    if (!correlationId) throw new Error("Need valid `correlationId` to be available");

    const workflowTask = await fetchLatestWorkflowTask();
    if (!workflowTask || workflowTask.Name !== "PersistFinancialInfo")
      throw new Error("Available workflowTaskId is not applicable to customers/financial/details");

    return api<string>(
      "v1",
      "customers/financial/details",
      "POST",
      undefined,
      { ...values },
      {
        ["X-Workflow-Task-Id"]: workflowTask.Id,
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}
