import { useMutation } from "react-query";

import sendApiRequest from "@/api";

export default function useOnboardingRevertTask() {
  return useMutation(
    ({ correlationId, WorkflowTask }: { correlationId: string; WorkflowTask: { Id: string; Name: string } }) => {
      return sendApiRequest<void>("v1", "customers/revert/task", "PUT", undefined, undefined, {
        ["x-Correlation-Id"]: correlationId,
        ["X-Workflow-Task-Id"]: WorkflowTask.Id,
      });
    }
  );
}
