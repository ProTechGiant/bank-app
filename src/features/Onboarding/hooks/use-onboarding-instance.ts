import { useMutation } from "react-query";

import api from "@/api";

export default function useOnboardingInstance() {
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
      return api<void>(
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
