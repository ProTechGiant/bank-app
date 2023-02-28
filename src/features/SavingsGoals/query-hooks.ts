import { format } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "react-query";

import api from "@/api";

import { CreateGoalInput, SavingsPot } from "./types";

const queryKeys = {
  all: ["savings-pots"] as const,
  roundupActive: () => [...queryKeys.all, "roundup-active"] as const,
  details: (savingsPotId: string) => [...queryKeys.all, { savingsPotId }] as const,
};

interface CreateGoalResponse {
  SavingsPotId: string;
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
        "customers/savings-pot",
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
    return api<RoundUpActiveResponse>("v1", "customers/savings-pot/roundup-active", "GET", undefined, undefined, {
      ["x-correlation-id"]: "1234567",
    });
  });
}

interface FundSavingsPotRecurringOptions {
  SavingsPotId: string;
  Amount: number;
  StartingDate: Date;
  DayOfMonth: number;
}

interface FundSavingsPotOneTimeOptions {
  SavingsPotId: string;
  Amount: number;
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
      const { SavingsPotId, ...bodyOptions } = options;

      return api<FundSavingsPotResponse>(
        "v1",
        `customers/savings-pot/${SavingsPotId}/fund/${methodPath}`,
        "POST",
        undefined,
        {
          ...bodyOptions,
          StartingDate: isRecurringFunding(options) ? format(options.StartingDate, "yyyy-MM-d") : undefined,
        },
        {
          "X-Correlation-ID": "12345",
        }
      );
    },
    {
      onSettled: (_data, _error, variables) => {
        queryClient.invalidateQueries(queryKeys.all);
        queryClient.invalidateQueries(queryKeys.details(variables.SavingsPotId));
      },
    }
  );
}

export interface SavingsPotDetailsResponse {
  SavingsPotId: string;
  SavingsPotName: string;
  GoalAmount: number;
  GoalBalance: number;
  RecommendedAmount: number;
  TargetDate: string;
  CreatedDate: string;
  MainAccountAmount: number;
  HadOneTimeFund: boolean;
  HadRecurringFund: boolean;
}

export function useSavingsPot(savingsPotId: string) {
  return useQuery(queryKeys.details(savingsPotId), () => {
    return api<SavingsPotDetailsResponse>(
      "v1",
      `customers/savings-pot/${savingsPotId}/details`,
      "GET",
      undefined,
      undefined,
      {
        "X-Correlation-ID": "12345",
      }
    );
  });
}

interface SavingsPotsResponse {
  SavingsPots: SavingsPot[];
}

export function useSavingsPots() {
  return useQuery(queryKeys.all, () => {
    return api<SavingsPotsResponse>("v1", "customers/savings-pot/all", "GET", undefined, undefined, {
      ["x-correlation-id"]: "12345",
    });
  });
}

// TODO - test when API endpoint is ready

interface WithdrawSavingsPot {
  PaymentAmount: string;
  Currency: string;
  CreditorAccount: string;
  savingsPotId: string;
}

interface WithdrawSavingsPotResponse {
  status: number;
}

export function useWithdrawSavingsPot(options: WithdrawSavingsPot) {
  const queryClient = useQueryClient();
  const { savingsPotId } = options;
  return useMutation(
    (options: WithdrawSavingsPot) => {
      return api<WithdrawSavingsPotResponse>(
        "v1",
        `customers/savings-pot/${savingsPotId}/withdraw-funds`,
        "POST",
        undefined,
        {
          options,
        },
        {
          "X-Correlation-ID": "12345",
        }
      );
    },
    {
      onSettled: (_data, _error) => {
        queryClient.invalidateQueries(queryKeys.all);
        queryClient.invalidateQueries(queryKeys.details(savingsPotId));
      },
    }
  );
}
