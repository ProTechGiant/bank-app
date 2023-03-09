import { useMutation } from "react-query";

import api from "@/api";

interface FreezeCardResponse {
  Status: string;
  IsOtpRequired: boolean;
}

interface UnfreezeCardResponse {
  IsOtpRequired: boolean;
  OtpId: string;
  OtpCode: string;
}

export function useFreezeCard() {
  return useMutation(({ cardId }: { cardId: string }) => {
    return api<FreezeCardResponse>(
      "v1",
      `cards/${cardId}`,
      "POST",
      undefined,
      { Status: "freeze" },
      {
        ["x-correlation-id"]: String(Math.floor(Math.random() * 1000000000)),
      }
    );
  });
}

export function useUnfreezeCard() {
  return useMutation(({ cardId }: { cardId: string }) => {
    return api<UnfreezeCardResponse>(
      "v1",
      `cards/${cardId}`,
      "POST",
      undefined,
      { Status: "unfreeze" },
      {
        ["x-correlation-id"]: String(Math.floor(Math.random() * 1000000000)),
      }
    );
  });
}
