import { useMutation } from "react-query";

import api from "@/api";

import { useOnboardingContext } from "../../context/OnboardingContext";
import ApiOnboardingError from "../../types/ApiOnboardingError";
import NafathDetails from "./NafathDetails";

export default function useNafathDetails() {
  const { fetchLatestWorkflowTask, userId, nationalId, correlationId } = useOnboardingContext();

  return useMutation(async () => {
    if (undefined === userId || undefined === correlationId)
      throw new Error("Cannot fetch customers/data without `userId` and `correlationId`");

    const workflowTask = await fetchLatestWorkflowTask();
    if (!workflowTask || workflowTask.name !== "RetrievePersonalDetails")
      throw new Error("Available workflowTaskId is not applicable to customers/data");

    return api<NafathDetails, ApiOnboardingError>(
      "api-dev",
      "v1",
      "customers/data",
      "POST",
      undefined,
      {
        NationalId: nationalId,
      },
      {
        ["userId"]: userId,
        ["X-Workflow-Task-Id"]: workflowTask.id,
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}
