import { useMutation } from "react-query";

import sendApiRequest from "@/api";

import ApiOnboardingError from "../types/ApiOnboardingError";

export default function useOnboardingTasks() {
  return useMutation(({ userId, correlationId }: { userId: string; correlationId: string }) => {
    return sendApiRequest<{ tasks: { id: string; name: string }[] }, ApiOnboardingError>(
      "api-dev",
      "v1",
      "tasks",
      "GET",
      undefined,
      undefined,
      {
        ["UserId"]: userId,
        ["x-Correlation-Id"]: correlationId,
      }
    );
  });
}
