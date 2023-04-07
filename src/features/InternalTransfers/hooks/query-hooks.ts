import { useQuery } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

import { TransferReason } from "../types";

interface ReasonsResponse {
  TransferReason: TransferReason[];
}

export function useTransferReasons() {
  const reasons = useQuery(["personalReason"], () => {
    return api<ReasonsResponse>("v1", "payments/reason-for-payment", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["UserId"]: "301",
    });
  });

  return reasons.data;
}
