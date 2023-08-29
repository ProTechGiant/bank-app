import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

import { getMockDocuments } from "../mock/mock";
import { DownloadDocumentResponse, PaginationInterface, RetryAdHocResponse } from "../types";

const queryKeys = {
  all: () => ["data"],
  adHocDocuments: (pagination: PaginationInterface) => ["adHocDocumentList", pagination] as const,
};

export function useGetDocuments(pagination: PaginationInterface) {
  return useQuery(queryKeys.adHocDocuments(pagination), () => {
    return getMockDocuments(pagination);
  });
}

export function useRetryAdHocDocument() {
  return useMutation(async (adhocDocRequestId: string) => {
    return api<RetryAdHocResponse>("v1", `adhoc-documents/${adhocDocRequestId}/retry`, "POST", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}

export function useGetCustomerOnboardingDate() {
  //  For this api user-id will be this: 0000001904
  return useQuery(["CustomerOnboardingDate"], () => {
    return api<{ OnboardingDate: string }>("v1", "statements/customers-onboarding-date", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}

export function useDownloadDocument(documentId: string) {
  const { i18n } = useTranslation();

  return useQuery(
    queryKeys.all(),
    () => {
      return api<DownloadDocumentResponse>("v1", `/v1/adhoc-documents/${documentId}`, "GET", undefined, undefined, {
        ["x-correlation-id"]: generateRandomId(),

        ["Accept-Language"]: i18n.language.toUpperCase(),
      });
    },

    { cacheTime: 0 }
  );
}
