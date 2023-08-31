import queryString from "query-string";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

import { StatementLanguageTypes, StatementTypes } from "../constants";
import {
  DownloadStatementResponse,
  GetAccessStatementApiResponse,
  PaginationInterface,
  RetryRequestInterface,
} from "../types";

const queryKeys = {
  all: () => ["data"] as const,
  accessStatements: (pagination: PaginationInterface, language: StatementLanguageTypes | null) =>
    ["statements", pagination, language ?? ""] as const,
};

export function useGetCustomerStatements(
  pagination: PaginationInterface,
  statementType: StatementTypes,
  language: StatementLanguageTypes | null
) {
  const { i18n } = useTranslation();
  let queryParams: queryString.StringifiableRecord = {
    pageSize: pagination.limit,
    offset: pagination.offset,
    statementType,
  };
  if (language) queryParams = { ...queryParams, language };
  return useQuery(
    queryKeys.accessStatements(pagination, language),
    () => {
      return api<GetAccessStatementApiResponse>("v1", `statements`, "GET", queryParams, undefined, {
        ["x-correlation-id"]: generateRandomId(),
        ["Accept-Language"]: i18n.language.toUpperCase(),
      });
    },
    {
      retry: false,
    }
  );
}

export function useDownloadStatement(documentID: string) {
  const { i18n } = useTranslation();
  return useQuery(
    queryKeys.all(),
    () => {
      return api<DownloadStatementResponse>("v1", `statements/download/${documentID}`, "GET", undefined, undefined, {
        ["x-correlation-id"]: generateRandomId(),
        ["Accept-Language"]: i18n.language.toUpperCase(),
      });
    },
    { cacheTime: 0 }
  );
}

export function useGetCustomerOnboardingDate() {
  //  For this api user-id will be this: 0000001904
  return useQuery(["CustomerOnboardingDate"], () => {
    return api<{ OnboardingDate: string }>("v1", "statements/customers-onboarding-date", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}

interface CreateCustomDateStatementParams {
  StatementStartDate?: string;
  StatementEndDate?: string;
  PredefinedTimeFrame?: string;
  StatementLanguage: string;
  OnboardingDate: string;
}

export function useCreateCustomDateStatement() {
  const { i18n } = useTranslation();

  return useMutation(async (body: CreateCustomDateStatementParams) => {
    return api<{ StatementRequestId: string }>("v1", "statements", "POST", undefined, body, {
      ["x-correlation-id"]: generateRandomId(),
      ["Accept-Language"]: i18n.language.toUpperCase(),
    });
  });
}

export function useRetryFailedStatement() {
  const { i18n } = useTranslation();

  return useMutation((documentId: string) => {
    return api<RetryRequestInterface>(
      "v1",
      `statements/retry-custom-date/${documentId}`,
      "POST",
      undefined,
      undefined,
      {
        ["x-correlation-id"]: generateRandomId(),
        ["Accept-Language"]: i18n.language.toUpperCase(),
      }
    );
  });
}
