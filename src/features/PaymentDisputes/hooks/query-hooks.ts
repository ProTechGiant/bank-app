import { useQuery } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

import { DisputeReasonType, TransactionType } from "../types";

interface DisputeReasonResponse {
  ProblemCategories: DisputeReasonType[];
}

export function useReasons(type: TransactionType) {
  const reasons = useQuery("dispute-reasons", () => {
    return api<DisputeReasonResponse>("v1", `payments/case/reasons`, "GET", { transactionType: type }, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });

  return reasons;
}
