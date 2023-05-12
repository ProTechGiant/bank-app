import { useMutation, useQuery } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

import { CreateDisputeInput, DisputeCase, DisputeCaseListItem, DisputeReasonType, TransactionType } from "../types";

const queryKeys = {
  all: () => ["payment-disputes"] as const,
  reasons: () => [...queryKeys.all(), "reasons"] as const,
  myCases: () => [...queryKeys.all(), "my-cases"] as const,
  caseDetails: (transactionId: string) => [...queryKeys.all(), "case-detail", { transactionId }] as const,
};

interface DisputeReasonResponse {
  PaymentCaseCategories: DisputeReasonType[];
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
  DisputeCases: DisputeCaseListItem[];
}

export function useMyCases() {
  return useQuery(queryKeys.myCases(), () => {
    return api<MyCasesResponse>("v1", `customers/cases`, "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}

interface CreateCaseResponse {
  CaseNumber: string;
}

export function useCreateCase() {
  return useMutation(
    async ({
      createDisputeUserId,
      isCardFrozen,
      reasonCode,
      values,
    }: {
      createDisputeUserId: string;
      isCardFrozen: boolean;
      reasonCode: string | undefined;
      values: CreateDisputeInput;
    }) => {
      return api<CreateCaseResponse>(
        "v1",
        "payments/cases",
        "POST",
        undefined,
        {
          ...values,
          CaseReasonCode: reasonCode,
          TransactionReference: "trans-ref-1", // TODO: should be transaction ID but now only some transaction ref are valid. (BE issue)
          TransactionSource: "ATM", // TODO: hardcoded for now because we don't have it from transactions
          CardId: "872130032", // TODO: hardcoded for now because we don't have card ID from transactions
          FreezeCardFlag: isCardFrozen,
          EnableNotification: false, // TODO:  hardcoded to false for now. BE TBC whether it's useful because we don't have this in UI.
          DmsAttachment: "12345", // TODO: file upload BE is out of scope in BC5
        },
        {
          ["x-correlation-id"]: generateRandomId(),
          ["UserId"]: createDisputeUserId, // TODO: temporary user ID
        }
      );
    }
  );
}

export function useCaseDetails(transactionRef: string) {
  return useQuery(queryKeys.caseDetails(transactionRef), () => {
    return api<DisputeCase>("v1", `payments/case-detail/${transactionRef}`, "GET", undefined, undefined, {
      "X-Correlation-ID": generateRandomId(),
    });
  });
}
