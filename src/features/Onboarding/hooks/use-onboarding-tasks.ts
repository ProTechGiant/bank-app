import { useMutation } from "react-query";

import sendApiRequest from "@/api";

interface ApiOnboardingTasksResponse {
  Tasks: Array<{ Id: string; Name: string }>;
}

export default function useOnboardingTasks() {
  return useMutation(({ correlationId }: { correlationId: string }) => {
    return sendApiRequest<ApiOnboardingTasksResponse>("v1", "tasks", "GET", undefined, undefined, {
      ["x-Correlation-Id"]: correlationId,
    });
  });
}
