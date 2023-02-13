import { useQuery } from "react-query";

import api from "@/api";
import { useTemporaryContext } from "@/contexts/TemporaryContext";

export interface SavingsPotDetailsResponse {
  SavingsPotId: string;
  SavingsPotName: string;
  GoalAmount: number;
  GoalBalance: number;
  RecommendedAmount: number;
  TargetDate: string;
  CreatedDate: string;
  MainAccountAmount: number;
}

export default function useSavingsPot(savingsPotId: string) {
  const { temporaryUserId } = useTemporaryContext();

  return useQuery(["savings-pot", { savingsPotId }], () => {
    return api<SavingsPotDetailsResponse>(
      "api-dev",
      "v1",
      `customers/savings-pot/${savingsPotId}/details`,
      "GET",
      undefined,
      undefined,
      {
        "X-Correlation-ID": "12345",
        UserId: temporaryUserId,
      }
    );
  });
}
