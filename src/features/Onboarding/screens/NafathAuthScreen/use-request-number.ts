import { useMutation } from "react-query";

import api from "@/api";

import { useOnboardingContext } from "../../context/OnboardingContext";

interface OtpResponseType {
  LinkId: string;
  Otp: number;
}

export default function useRequestNumber() {
  const { nationalId, correlationId } = useOnboardingContext();

  return useMutation(async () => {
    if (!correlationId) throw new Error("Need valid `correlationId` to be available");

    return api<OtpResponseType>(
      "v1",
      "customers/link",
      "POST",
      undefined,
      {
        NationalId: nationalId,
      },
      {
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}
