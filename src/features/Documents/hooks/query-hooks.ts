import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

import {
  DocumentsFilterInterface,
  DownloadDocumentResponse,
  GetDocumentsApiResponse,
  PaginationInterface,
  RequestDocumentData,
  RetryAdHocResponse,
} from "../types";

const queryKeys = {
  all: () => ["data"],
  adHocDocuments: (pagination: PaginationInterface, documentFilters: DocumentsFilterInterface) =>
    ["adHocDocumentList", pagination, documentFilters] as const,
};

export function useGetDocuments(pagination: PaginationInterface, documentFilters: DocumentsFilterInterface) {
  const { i18n } = useTranslation();

  const queryParams = {
    pageOffset: pagination.offset,
    pageSize: pagination.limit,
    documentCategory: documentFilters.documentType,
    language: documentFilters.language,
    status: documentFilters.status,
  };

  return useQuery(queryKeys.adHocDocuments(pagination, documentFilters), () => {
    return api<GetDocumentsApiResponse>("v1", `adhoc-documents`, "GET", queryParams, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["Accept-Language"]: i18n.language.toUpperCase(),
    });
  });
}

export function useRetryAdHocDocument() {
  const { i18n } = useTranslation();

  return useMutation(async (adhocDocRequestId: string) => {
    return api<RetryAdHocResponse>("v1", `adhoc-documents/${adhocDocRequestId}/retry`, "POST", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["Accept-Language"]: i18n.language.toUpperCase(),
    });
  });
}

export function useRequestAdHocDocument() {
  const { i18n } = useTranslation();

  return useMutation(async (data: RequestDocumentData) => {
    return api<RetryAdHocResponse>("v1", `adhoc-documents`, "POST", undefined, data, {
      ["x-correlation-id"]: generateRandomId(),
      ["Accept-Language"]: i18n.language.toUpperCase(),
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
      return api<DownloadDocumentResponse>("v1", `adhoc-documents/${documentId}`, "GET", undefined, undefined, {
        ["x-correlation-id"]: generateRandomId(),

        ["Accept-Language"]: i18n.language.toUpperCase(),
      });
    },

    { cacheTime: 0 }
  );
}
