import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";

import api from "@/api";

import { StatementTypes } from "../constants";
import { useStatementContext } from "../contexts/StatementContext";
import { getMockStatements } from "../mocks/AccessStatementData";
import { DownloadStatementResponse, PaginationInterface } from "../types";

const queryKeys = { all: () => ["data"] as const };
export function useGetCustomerStatements(pagination: PaginationInterface, _statement: StatementTypes) {
  return useQuery(["accessStatements", pagination], () => {
    return getMockStatements(pagination);
  });
}

export function useDownloadStatement(documentID: string) {
  const { i18n } = useTranslation();
  const { correlationId } = useStatementContext();
  if (!correlationId) throw new Error("Need valid `correlationId` to be available");
  return useQuery(
    queryKeys.all(),
    () => {
      return api<DownloadStatementResponse>("v1", `statements/download/${documentID}`, "GET", undefined, undefined, {
        ["x-correlation-id"]: correlationId,
        ["Accept-Language"]: i18n.language.toUpperCase(),
      });
    },
    { cacheTime: 0 }
  );
}

export function useGetCustomerOnboardingDate() {
  const { correlationId } = useStatementContext();
  if (!correlationId) throw new Error("Need valid `correlationId` to be available");

  return useQuery(["CustomerOnboardingDate"], () => {
    return api<{ OnboardingDate: string }>("v1", "statements/customers-onboarding-date", "GET", undefined, undefined, {
      ["x-correlation-id"]: correlationId, // TODO: Later will remove generateRandomId
    });
  });
}

interface CreateCustomDateStatementParams {
  PredefinedTimeFrame: string;
  StatementLanguage: string;
  OnboardingDate: string;
}

export function useCreateCustomDateStatement() {
  const { i18n } = useTranslation();
  const { correlationId } = useStatementContext();

  if (!correlationId) throw new Error("Need valid `correlationId` to be available");

  return useMutation(async (body: CreateCustomDateStatementParams) => {
    return api<{ StatementRequestId: string }>("v1", "statements/custom-date", "POST", undefined, body, {
      ["x-correlation-id"]: correlationId, // TODO: Later will remove generateRandomId
      ["Accept-Language"]: i18n.language.toUpperCase(),
    });
  });
}
