import { useMutation } from "react-query";

import api from "@/api";

import { useOnboardingContext } from "../../context/OnboardingContext";
import ApiOnboardingError from "../../types/ApiOnboardingError";

export default function useConfirmPersonalDetails() {
  const { fetchLatestWorkflowTask, userId, correlationId } = useOnboardingContext();

  return useMutation(async (email: string | undefined) => {
    if (!userId || !correlationId) throw new Error("Need valid `userId` and `correlationId` to be available");

    const workflowTask = await fetchLatestWorkflowTask();
    if (!workflowTask || workflowTask.name !== "ConfirmPersonalDetails")
      throw new Error("Available workflowTaskId is not applicable to customers/confirm/data");

    return api<string, ApiOnboardingError>(
      "api-dev",
      "v1",
      "customers/confirm/data",
      "POST",
      undefined,
      {
        CustomerConfirmationFlag: true,
        Email: !!email && email.length > 0 ? email : null,
      },
      {
        ["X-Workflow-Task-Id"]: workflowTask?.id,
        ["UserId"]: userId,
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}
