import { format } from "date-fns";
import { useMutation } from "react-query";

import api from "@/api";
import { useTemporaryContext } from "@/contexts/TemporaryContext";

interface FundSavingsPotRecurringOptions {
  SavingsPotId: string;
  Amount: number;
  StartingDate: Date;
  DayOfMonth: number;
}

interface FundSavingsPotOneTimeOptions {
  SavingsPotId: string;
  Amount: number;
}

type FundSavingsPotOptions = FundSavingsPotOneTimeOptions | FundSavingsPotRecurringOptions;

function isRecurringFunding(options: FundSavingsPotOptions): options is FundSavingsPotRecurringOptions {
  return undefined !== (options as FundSavingsPotRecurringOptions).DayOfMonth;
}

interface FundSavingsPotResponse {
  NextPaymentDate?: string; // only for recurring payment
}

export default function useFundSavingsPot() {
  const { temporaryUserId } = useTemporaryContext();

  return useMutation((options: FundSavingsPotOptions) => {
    const methodPath = isRecurringFunding(options) ? "recurring" : "one-time";
    const { SavingsPotId, ...bodyOptions } = options;

    return api<FundSavingsPotResponse>(
      "api-dev",
      "v1",
      `customers/savings-pot/${SavingsPotId}/fund/${methodPath}`,
      "POST",
      undefined,
      {
        ...bodyOptions,
        StartingDate: isRecurringFunding(options) ? format(options.StartingDate, "yyyy-MM-d") : undefined,
      },
      {
        "X-Correlation-ID": "12345",
        UserId: temporaryUserId,
      }
    );
  });
}
