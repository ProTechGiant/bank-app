import { useQuery } from "react-query";

import api from "@/api";
import { useTemporaryContext } from "@/contexts/TemporaryContext";

interface RoundUpActiveResponse {
  IsRoundUpActive: boolean;
}

export default function useIsRoundupActive() {
  const { temporaryUserId } = useTemporaryContext();

  return useQuery(["savings-pots", "roundup-active"], () => {
    return api<RoundUpActiveResponse>(
      "api-dev",
      "v1",
      "customers/savings-pot/roundup-active",
      "GET",
      undefined,
      undefined,
      {
        ["UserId"]: temporaryUserId,
        ["x-correlation-id"]: "1234567",
      }
    );
  });
}
