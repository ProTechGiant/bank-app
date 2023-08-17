import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

import { StatementTypes } from "../constants";
import { getMockStatments } from "../mocks/AccessStatementData";
import { PaginationInterface } from "../types";

export function useGetCustomerStatements(pagination: PaginationInterface, _statement: StatementTypes) {
  return useQuery(["accessStatments", pagination], () => {
    return getMockStatments(pagination);
  });
}

export function useGetCustomerOnboardingDate() {
  return useQuery(["CustomerOnboardingDate"], () => {
    return api<{ OnboardingDate: string }>("v1", "statements/customers-onboarding-date", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(), // TODO: Later will remove generateRandomId
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

  return useMutation(async (body: CreateCustomDateStatementParams) => {
    return api<{ StatementRequestId: string }>("v1", "statements/custom-date", "POST", undefined, body, {
      ["x-correlation-id"]: generateRandomId(), // TODO: Later will remove generateRandomId
      ["Accept-Language"]: i18n.language.toUpperCase(),
    });
  });
}
