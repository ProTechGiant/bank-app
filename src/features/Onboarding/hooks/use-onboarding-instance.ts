import { useMutation } from "react-query";

import sendApiRequest from "@/api";

import ApiOnboardingError from "../types/ApiOnboardingError";

interface useOnboardingInstanceRequest {
  userId: string;
  correlationId: string;
}

export default function useOnboardingInstance() {
  return useMutation(({ userId, correlationId }: useOnboardingInstanceRequest) => {
    return sendApiRequest<number, ApiOnboardingError>(
      "api-dev",
      "v1",
      "processes/personal-onboarding/instances",
      "POST",
      undefined,
      undefined,
      {
        ["UserId"]: userId,
        ["x-Correlation-Id"]: correlationId,
      }
    );
  });
}
