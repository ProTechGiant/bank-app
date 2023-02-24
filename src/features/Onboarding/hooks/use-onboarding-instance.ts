import { useMutation } from "react-query";

import api from "@/api";

export default function useOnboardingInstance() {
  return useMutation(({ correlationId }: { correlationId: string }) => {
    return api<number>("v1", "processes/personal-onboarding/instances", "POST", undefined, undefined, {
      ["x-Correlation-Id"]: correlationId,
    });
  });
}
