import { useMutation } from "react-query";

import sendApiRequest from "@/api";

interface ApiSignInTasksResponse {
  Tasks: Array<{ Id: string; Name: string }>;
}

export function useSignInInstance() {
  return useMutation(
    ({
      correlationId,
      NationalId,
      MobileNumber,
    }: {
      correlationId: string;
      NationalId: string;
      MobileNumber: string;
    }) => {
      return sendApiRequest<void>(
        "v1",
        "customers/state",
        "POST",
        undefined,
        {
          NationalId: NationalId,
          MobileNumber: MobileNumber,
        },
        {
          ["x-Correlation-Id"]: correlationId,
        }
      );
    }
  );
}

export function useSignInRevertTask() {
  return useMutation(
    ({ correlationId, WorkflowTask }: { correlationId: string; WorkflowTask: { Id: string; Name: string } }) => {
      return sendApiRequest<void>("v1", "customers/revert/task", "PUT", undefined, undefined, {
        ["x-Correlation-Id"]: correlationId,
        ["X-Workflow-Task-Id"]: WorkflowTask.Id,
      });
    }
  );
}

export function useSignInTasks() {
  return useMutation(({ correlationId }: { correlationId: string }) => {
    return sendApiRequest<ApiSignInTasksResponse>("v1", "tasks", "GET", undefined, undefined, {
      ["x-Correlation-Id"]: correlationId,
    });
  });
}
