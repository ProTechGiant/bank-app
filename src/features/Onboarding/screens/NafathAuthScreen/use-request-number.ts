import { useMutation } from "react-query";

import api from "@/api";

import { useOnboardingContext } from "../../context/OnboardingContext";

interface OtpResponseType {
  LinkId: string;
  Otp: number;
}

export default function useRequestNumber() {
  const { nationalId, correlationId, userId } = useOnboardingContext();

  return useMutation(async () => {
    if (!userId || !correlationId) throw new Error("Need valid `userId` and `correlationId` to be available");

    return api<OtpResponseType>(
      "api-dev",
      "v1",
      "customers/link",
      "POST",
      undefined,
      {
        NationalId: nationalId,
      },
      {
        ["userId"]: userId,
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}
