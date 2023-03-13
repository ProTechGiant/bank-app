import { format } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

import { CreateGoalInput, SavingsPot } from "./types";

const queryKeys = {
  all: ["savings-pots"] as const,
  roundupActive: () => [...queryKeys.all, "roundup-active"] as const,
  details: (PotId: string) => [...queryKeys.all, { PotId }] as const,
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
          ["x-correlation-id"]: "1234567",
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

interface RoundUpActiveResponse {
  IsRoundUpActive: boolean;
}

export function useIsRoundupActive() {
  return useQuery(queryKeys.roundupActive(), () => {
    return api<RoundUpActiveResponse>("v1", "customers/savings-pots/roundup-active", "GET", undefined, undefined, {
      ["x-correlation-id"]: "1234567",
    });
  });
}

interface FundSavingsPotRecurringOptions {
  PotId: string;
  PaymentAmount: number;
  Currency: string;
  DebitorAccount: string;
  StartingDate: Date;
  DayOfMonth: number;
}

interface FundSavingsPotOneTimeOptions {
  PotId: string;
  PaymentAmount: number;
  Currency: string;
  DebitorAccount: string;
}

type FundSavingsPotOptions = FundSavingsPotOneTimeOptions | FundSavingsPotRecurringOptions;

function isRecurringFunding(options: FundSavingsPotOptions): options is FundSavingsPotRecurringOptions {
  return undefined !== (options as FundSavingsPotRecurringOptions).DayOfMonth;
}

interface FundSavingsPotResponse {
  NextPaymentDate?: string; // only for recurring payment
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
          StartingDate: isRecurringFunding(options) ? format(options.StartingDate, "yyyy-MM-dd") : undefined,
        },
        {
          "X-Correlation-ID": "12345",
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

export interface SavingsPotDetailsResponse {
  PotId: string;
  GoalName: string;
  TargetAmount: string;
  TargetCurrency: string;
  AvailableBalanceAmount: string;
  AvailableBalanceCurrency: string;
  TargetDate: string;
  CreatedDate: string;
  RoundupFlag: boolean;
  NotificationFlag: boolean;
  CustomerId: string;
  AccountId: string;
  RecurringPayments: {
    PaymentAmount: number;
    Currency: string;
    CreditorAccount: string;
    PaymentFrequency: number;
    StartingDate: string;
    EndDate: string;
    RemittanceInformation: string;
    E2EReference: string;
    NextPaymentDate: string;
  };
}

export function useSavingsPot(PotId: string) {
  return useQuery(queryKeys.details(PotId), () => {
    return api<SavingsPotDetailsResponse>("v1", `customers/savings-pots/${PotId}`, "GET", undefined, undefined, {
      "X-Correlation-ID": "12345",
    });
  });
}

interface SavingsPotsResponse {
  SavingsPots: SavingsPot[];
}

export function useSavingsPots() {
  return useQuery(queryKeys.all, () => {
    return api<SavingsPotsResponse>("v1", "customers/savings-pots", "GET", undefined, undefined, {
      ["x-correlation-id"]: "12345",
    });
  });
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
