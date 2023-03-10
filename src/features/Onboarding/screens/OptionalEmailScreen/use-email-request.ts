import { useMutation } from "react-query";

import api from "@/api";

import { useOnboardingContext } from "../../context/OnboardingContext";

export default function useEmail() {
  const { fetchLatestWorkflowTask, correlationId } = useOnboardingContext();

  return useMutation(async (email: string | undefined) => {
    if (!correlationId) throw new Error("Need valid `correlationId` to be available");

    const workflowTask = await fetchLatestWorkflowTask();
    if (!workflowTask || workflowTask.Name !== "PersistEmail")
      throw new Error("Available workflowTaskId is not applicable to customers/email");

    return api<string>(
      "v1",
      "customers/email",
      "PUT",
      undefined,
      {
        Email: !!email && email.length > 0 ? email : null,
      },
      {
        ["X-Workflow-Task-Id"]: workflowTask?.Id,
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}
