import { useQuery } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

import { DisputeCase, DisputeReasonType, TransactionType } from "../types";

const queryKeys = {
  all: () => ["payment-disputes"] as const,
  reasons: () => [...queryKeys.all(), "reasons"] as const,
  myCases: () => [...queryKeys.all(), "my-cases"] as const,
};

interface DisputeReasonResponse {
  ProblemCategories: DisputeReasonType[];
}

export function useReasons(type: TransactionType) {
  return useQuery(
    queryKeys.reasons(),
    () => {
      return api<DisputeReasonResponse>("v1", `payments/case/reasons`, "GET", { transactionType: type }, undefined, {
        ["x-correlation-id"]: generateRandomId(),
      });
    },
    {
      cacheTime: Infinity,
      staleTime: 1000 * 60 * 60 * 24, // 1 day
    }
  );
}

interface MyCasesResponse {
  DisputeCases: DisputeCase[];
}

export function useMyCases() {
  return useQuery(queryKeys.myCases(), () => {
    return api<MyCasesResponse>("v1", `customers/cases`, "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}
