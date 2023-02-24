import { useMutation } from "react-query";

import sendApiRequest from "@/api";

import ApiOnboardingError from "../types/ApiOnboardingError";

export default function useOnboardingTasks() {
  return useMutation(({ userId, correlationId }: { userId: string; correlationId: string }) => {
    return sendApiRequest<{ Tasks: { Id: string; Name: string }[] }, ApiOnboardingError>(
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
