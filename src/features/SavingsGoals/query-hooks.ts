import { format } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "react-query";

import api from "@/api";
import { useTemporaryContext } from "@/contexts/TemporaryContext";

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
  const { temporaryUserId } = useTemporaryContext();
  const queryClient = useQueryClient();

  return useMutation(
    (values: CreateGoalInput) => {
      return api<CreateGoalResponse, CreateGoalError>(
        "api-dev",
        "v1",
        "customers/savings-pot",
        "POST",
        undefined,
        { ...values, targetDate: format(values.TargetDate, "yyyy-MM-d") },
        {
          ["UserId"]: temporaryUserId,
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
  const { temporaryUserId } = useTemporaryContext();

  return useQuery(queryKeys.roundupActive(), () => {
    return api<RoundUpActiveResponse>(
      "api-dev",
      "v1",
      "customers/savings-pot/roundup-active",
      "GET",
      undefined,
      undefined,
      {
        ["UserId"]: temporaryUserId,
        ["x-correlation-id"]: "1234567",
      }
    );
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
  const { temporaryUserId } = useTemporaryContext();
  const queryClient = useQueryClient();

  return useMutation(
    (options: FundSavingsPotOptions) => {
      const methodPath = isRecurringFunding(options) ? "recurring" : "one-time";
      const { SavingsPotId, ...bodyOptions } = options;

      return api<FundSavingsPotResponse>(
        "api-dev",
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
          UserId: temporaryUserId,
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
}

export function useSavingsPot(savingsPotId: string) {
  const { temporaryUserId } = useTemporaryContext();

  return useQuery(queryKeys.details(savingsPotId), () => {
    return api<SavingsPotDetailsResponse>(
      "api-dev",
      "v1",
      `customers/savings-pot/${savingsPotId}/details`,
      "GET",
      undefined,
      undefined,
      {
        "X-Correlation-ID": "12345",
        UserId: temporaryUserId,
      }
    );
  });
}

interface SavingsPotsResponse {
  SavingsPots: SavingsPot[];
}

export function useSavingsPots() {
  const { temporaryUserId } = useTemporaryContext();

  return useQuery(queryKeys.all, () => {
    return api<SavingsPotsResponse>("api-dev", "v1", "customers/savings-pot/all", "GET", undefined, undefined, {
      ["UserId"]: temporaryUserId,
      ["x-correlation-id"]: "12345",
    });
  });
}
