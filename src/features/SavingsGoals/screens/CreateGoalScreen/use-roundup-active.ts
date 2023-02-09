import { useQuery } from "react-query";

import api from "@/api";

interface RoundUpActiveResponse {
  IsRoundUpActive: boolean;
}

export default function useIsRoundupActive() {
  return useQuery(["savings-pots", "roundup-active"], () => {
    return api<RoundUpActiveResponse>(
      "api-dev",
      "v1",
      "customers/savings-pot/roundup-active",
      "GET",
      undefined,
      undefined,
      {
        ["UserId"]: "100116",
        ["x-correlation-id"]: "1234567",
      }
    );
  });
}
