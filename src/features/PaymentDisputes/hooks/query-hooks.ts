import { API_BASE_URL } from "@env";
import useFileUpload from "react-native-use-file-upload";
import { useMutation, useQuery } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

import { CASE_TYPE_MAPPING } from "../constants";
import {
  CasesCategoriesEnum,
  CreateDisputeInput,
  DisputeCase,
  DisputeCaseListItem,
  DisputeReasonType,
  TransactionType,
} from "../types";

const queryKeys = {
  all: () => ["payment-disputes"] as const,
  reasons: () => [...queryKeys.all(), "reasons"] as const,
  myCases: (category: CasesCategoriesEnum) => [...queryKeys.all(), "my-cases", category] as const,
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
  Cases: DisputeCaseListItem[];
}

export function useMyCases(categorySelected: CasesCategoriesEnum) {
  const { userId } = useAuthContext();
  return useQuery(queryKeys.myCases(categorySelected), () => {
    return api<MyCasesResponse>(
      "v1",
      `customers/${userId}/cases`,
      "GET",
      {
        ClassificationCode: CASE_TYPE_MAPPING[categorySelected],
      },
      undefined,
      {
        ["x-correlation-id"]: generateRandomId(),
      }
    );
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
      DocumentId,
      values,
    }: {
      createDisputeUserId: string;
      isCardFrozen: boolean;
      reasonCode: string | undefined;
      DocumentId: string | undefined;
      values: CreateDisputeInput;
    }) => {
      return api<CreateCaseResponse>(
        "v1",
        "payments/cases",
        "POST",
        undefined,
        {
          ...values,
          DocumentId,
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
  return useQuery(
    queryKeys.caseDetails(transactionRef),
    () => {
      return api<DisputeCase>("v1", `payments/case-detail/${transactionRef}`, "GET", undefined, undefined, {
        "X-Correlation-ID": generateRandomId(),
      });
    },
    { retry: false }
  );
}

interface useCaseUploadParams {
  onProgress: (event: any) => void;
  onDone: () => void;
  onError: () => void;
}

export function useCaseUpload(params: useCaseUploadParams) {
  const { userId, apiKey } = useAuthContext();

  const headers = new Headers();
  headers.append("X-Api-Key", apiKey || "");
  headers.append("UserId", userId || "");
  headers.append("x-correlation-id", generateRandomId());
  const url = "https://" + API_BASE_URL + "/" + "v1" + "/" + "payments/case-detail/upload";

  return useFileUpload({
    url,
    field: "document",
    method: "POST",
    headers: headers,
    ...params,
  });
}
