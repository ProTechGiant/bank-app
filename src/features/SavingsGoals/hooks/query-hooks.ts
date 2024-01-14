import { format } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "react-query";

import api from "@/api";
import { useCurrentAccount } from "@/hooks/use-accounts";
import { generateRandomId } from "@/utils";

import {
  CreateGoalInput,
  NotificationPreferencesResponse,
  SavingGoalTransactionsApiParams,
  SavingGoalTransactionsApiResponse,
  SavingsPot,
  SavingsPotDetailsResponse,
} from "../types";

const queryKeys = {
  all: ["savings-pots"] as const,
  roundupActive: () => [...queryKeys.all, "roundup-active"] as const,
  details: (PotId: string) => [...queryKeys.all, PotId] as const,
  notificationPreferencesFlag: "notificationPreferencesFlag" as const,
  recurringPayments: (PotId: string) => [...queryKeys.all, PotId, "recurring-payments"] as const,
  transactionList: (params: SavingGoalTransactionsApiParams) =>
    [...queryKeys.all, params, "transactions-list"] as const,
};

interface CreateGoalResponse {
  PotId: string;
}

interface CreateGoalError {
  Code: string;
  Message: string;
  Errors: Array<{ Message: string; Path: string }>;
  TraceId: string;
}

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation(
    (values: CreateGoalInput) => {
      return api<CreateGoalResponse, CreateGoalError>(
        "v1",
        "customers/savings-pots",
        "POST",
        undefined,
        { ...values, targetDate: format(values.TargetDate, "yyyy-MM-d") },
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      );
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(queryKeys.all);
      },
    }
  );
}

export function useSGNotificationPreferences() {
  return useQuery(queryKeys.notificationPreferencesFlag, () => {
    return api<NotificationPreferencesResponse>(
      "v1",
      `customers/savings-pots/notification-preferences`,
      "GET",
      undefined,
      undefined,
      {
        "X-Correlation-ID": generateRandomId(),
      }
    );
  });
}

interface RoundUpActiveResponse {
  IsRoundUpActive: boolean;
}

export function useRoundupFlag() {
  return useQuery(queryKeys.roundupActive(), () => {
    return api<RoundUpActiveResponse>("v1", "customers/savings-pots/roundup-active", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}

export interface UpdateSavingsGoalProps {
  GoalName: string;
  TargetAmount: string;
  TargetDate: string;
  RoundupFlag?: boolean;
  NotificationFlag: boolean;
  PotId: string;
}

export function useUpdateSavingsGoal() {
  const queryClient = useQueryClient();

  return useMutation(
    (options: UpdateSavingsGoalProps) => {
      const { PotId, ...requestBody } = options;
      return api<UpdateSavingsGoalProps>(
        "v1",
        `customers/savings-pots/${PotId}`,
        "PATCH",
        undefined,
        { ...requestBody },
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeys.all);
      },
    }
  );
}

export interface RemoveSavingsGoalProps {
  PotId: string;
}

export function useRemoveSavingsGoal() {
  const queryClient = useQueryClient();
  const correlationId = generateRandomId();

  return useMutation(
    ({ PotId }: RemoveSavingsGoalProps) => {
      return api<UpdateSavingsGoalProps>("v1", `customers/savings-pots/${PotId}`, "DELETE", undefined, undefined, {
        ["x-correlation-id"]: correlationId,
      });
    },
    {
      onSettled: (_data, _error) => {
        queryClient.invalidateQueries(queryKeys.all);
      },
    }
  );
}

interface FundSavingsPotRecurringOptions {
  PotId: string;
  PaymentAmount: number;
  Currency: string;
  StartingDate: Date;
  DayOfMonth: number;
  CreditorAccount: string;
  DebtorAccount: string;
  PaymentFrequency: string;
  Reference: string;
  PaymentDetails?: string[];
  Description?: string[];
}

interface FundSavingsPotOneTimeOptions {
  PotId: string;
  PaymentAmount: number;
  Currency: string;
  DebtorAccount: string;
}

export type FundSavingsPotOptions = FundSavingsPotOneTimeOptions | FundSavingsPotRecurringOptions;

function isRecurringFunding(options: FundSavingsPotOptions): options is FundSavingsPotRecurringOptions {
  return undefined !== (options as FundSavingsPotRecurringOptions).DayOfMonth;
}

export interface FundSavingsPotResponse {
  NextPaymentDate?: string; // only for Recurring payment
}

export function useFundSavingsPot() {
  const queryClient = useQueryClient();

  return useMutation(
    (options: FundSavingsPotOptions) => {
      const methodPath = isRecurringFunding(options) ? "recurring" : "one-time";
      const { PotId, ...bodyOptions } = options;

      return api<FundSavingsPotResponse>(
        "v1",
        `customers/savings-pots/${PotId}/fund/${methodPath}`,
        "POST",
        undefined,
        {
          ...bodyOptions,
          StartingDate: isRecurringFunding(options) ? options.StartingDate : undefined,
        },
        {
          "X-Correlation-ID": generateRandomId(),
        }
      );
    },
    {
      onSettled: (_data, _error, variables) => {
        queryClient.invalidateQueries(queryKeys.all);
        queryClient.invalidateQueries(queryKeys.details(variables.PotId));
      },
    }
  );
}

interface EditRecurringPayments {
  PotId: string;
  PaymentAmount: string;
  Currency: string;
  DebtorAccount: string;
  PaymentFrequency: string;
}

interface EditRecurringPaymentsResponse {
  PaymentAmount: string;
  Currency: string;
  CreditorAccount: string;
  PaymentFrequency: string;
  StartingDate: Date;
  EndDate: Date;
  RemittenceInformation: string;
  E2EReference: string;
  NextPaymentDate: string;
}

//TODO: Just a draft hook, revisit once BE has been completed
export function useEditPotRecurringPayment() {
  const queryClient = useQueryClient();

  return useMutation(
    (options: EditRecurringPayments) => {
      const { PotId, ...requestBody } = options;
      return api<EditRecurringPaymentsResponse>(
        "v1",
        `customers/savings-pots/${PotId}/recurring-payments`,
        "PATCH",
        undefined,
        {
          ...requestBody,
        },
        {
          "X-Correlation-ID": generateRandomId(),
          domesticStandingOrderId: requestBody.DebtorAccount,
        }
      );
    },
    {
      onSettled: (_data, _error, variables) => {
        queryClient.invalidateQueries(queryKeys.recurringPayments(variables.PotId));
      },
    }
  );
}

interface DeletePotRecurringPayment {
  PotId: string;
}
export function useDeletePotRecurringPayment() {
  const queryClient = useQueryClient();

  return useMutation(
    ({ PotId }: DeletePotRecurringPayment) => {
      return api<string>("v1", `customers/savings-pots/${PotId}/recurring-payments`, "DELETE", undefined, undefined, {
        "X-Correlation-ID": generateRandomId(),
      });
    },
    {
      onSettled: (_data, _error, variables) => {
        queryClient.invalidateQueries(queryKeys.recurringPayments(variables.PotId));
      },
    }
  );
}

export function useSavingsPot(PotId: string) {
  return useQuery(queryKeys.details(PotId), () => {
    return api<SavingsPotDetailsResponse>("v1", `customers/savings-pots/${PotId}`, "GET", undefined, undefined, {
      "X-Correlation-ID": generateRandomId(),
    });
  });
}

interface SavingsPotsResponse {
  SavingsPots: SavingsPot[];
}

export function useSavingsPots() {
  return useQuery(queryKeys.all, () => {
    return api<SavingsPotsResponse>("v1", "customers/savings-pots", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}

interface RecurringPaymentResponse {
  DomesticStandingOrderId: string;
  PaymentAmount: string;
  Currency: string;
  CreditorAccount: string;
  DebtorAccount: string;
  PaymentFrequency: string;
  EndDate: string;
  E2EReference: string;
  NextPaymentDate: string;
}

export function useRecurringPayments(PotId: string) {
  return useQuery(
    queryKeys.recurringPayments(PotId),
    () => {
      return api<RecurringPaymentResponse>(
        "v1",
        `customers/savings-pots/${PotId}/recurring-payments`,
        "GET",
        undefined,
        undefined,
        {
          "X-Correlation-ID": generateRandomId(),
        }
      );
    },
    {
      retry: false,
    }
  );
}

export interface WithdrawValues {
  PaymentAmount: number;
  Currency: string;
  CreditorAccount: string;
  PotId: string;
}

export function useWithdrawSavingsPot() {
  const queryClient = useQueryClient();

  return useMutation(
    (options: WithdrawValues) => {
      const { PotId, ...bodyOptions } = options;

      return api(
        "v1",
        `customers/savings-pots/${PotId}/withdraw-funds`,
        "POST",
        undefined,
        {
          ...bodyOptions,
        },
        {
          "X-Correlation-ID": generateRandomId(),
        }
      );
    },
    {
      onSettled: (_data, _error, variables) => {
        queryClient.invalidateQueries(queryKeys.all);
        queryClient.invalidateQueries(queryKeys.details(variables.PotId));
      },
    }
  );
}

export function useGetTransactionsByAccountId(params: SavingGoalTransactionsApiParams) {
  return useQuery(
    queryKeys.transactionList(params),
    () => {
      if (!params.accountId) throw new Error("Account Id does not exist");

      return api<SavingGoalTransactionsApiResponse>(
        "v1",
        `accounts/${params.accountId}/transactions`,
        "GET",
        { ...params },
        undefined,
        {
          "x-correlation-id": generateRandomId(),
        }
      );
    },
    {
      retry: false,
    }
  );
}
