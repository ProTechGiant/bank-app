import { useMemo } from "react";
import { useQuery } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

const CHANNEL_ID = "Mobile";
const MINIMAL_AMOUNT = 0.01;

const queryKeys = {
  all: () => ["transfers"] as const,
  transferLimit: (accountId: string | undefined) => [...queryKeys.all(), "transferLimit", { accountId }] as const,
};

interface TransferLimitResponse {
  AvailableAmount: string;
}

export function useTransferLimitAmount(accountId: string | undefined) {
  const { data } = useQuery(
    queryKeys.transferLimit(accountId),
    () => {
      return api<TransferLimitResponse>(
        "v1",
        `transfers/transaction-limits`,
        "GET",
        { channelId: CHANNEL_ID, accountId },
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      );
    },
    {
      enabled: accountId !== undefined,
    }
  );

  const transferLimitAmount = useMemo(() => {
    if (data) {
      const availableAmount = parseFloat(data?.AvailableAmount);
      return availableAmount > MINIMAL_AMOUNT ? availableAmount : 0;
    } else {
      return 0;
    }
  }, [data]);

  return { transferLimitAmount };
}
