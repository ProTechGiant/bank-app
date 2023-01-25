import { useMutation } from "react-query";

import sendApiRequest from "@/api";

import ApiOnboardingError from "../types/ApiOnboardingError";

export default function useOnboardingInstance() {
  return useMutation(({ userId }: { userId: string }) => {
    return sendApiRequest<number, ApiOnboardingError>(
      "api-dev",
      "v1",
      "processes/personal-onboarding/instances",
      "POST",
      undefined,
      undefined,
      {
        ["UserId"]: userId,
      }
    );
  });
}
