import { useMutation } from "react-query";

import api from "@/api";

import { useOnboardingContext } from "../../context/OnboardingContext";
import ApiOnboardingError from "../../types/ApiOnboardingError";
import { FatcaFormInput } from "./types";

export default function useFatcaDetails() {
  const { fetchLatestWorkflowTask, userId, correlationId } = useOnboardingContext();

  return useMutation(async (values: FatcaFormInput) => {
    if (!userId || !correlationId) throw new Error("Need valid `userId` and `correlationId` to be available");

    const workflowTask = await fetchLatestWorkflowTask();

    if (!workflowTask || workflowTask.Name !== "Fatca&Crs")
      throw new Error("Available workflowTaskId is not applicable to customers/tax/residency/details");

    return api<string, ApiOnboardingError>(
      "api-dev",
      "v1",
      "customers/tax/residency/details",
      "POST",
      undefined,
      values,
      {
        ["X-Workflow-Task-Id"]: workflowTask?.Id,
        ["UserId"]: userId,
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}
