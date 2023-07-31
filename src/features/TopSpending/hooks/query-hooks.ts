import { useQuery } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { useCurrentAccount } from "@/hooks/use-accounts";
import { generateRandomId } from "@/utils";

import { IntervalTypes } from "../enum";
import { GetMonthSpendingsComparisonSummary, GraghApiResponse, SingleSelectedMonthType, Tag } from "../types";

interface IncludedCategory {
  categoryId: string;
  categoryName: string;
  totalAmount: number;
  percentage: string;
  currency: string;
  transactionCount: number;
  iconPath?: string;
}

interface ExcludedCategories {
  categoryId?: string;
  categoryName?: string;
  totalAmount: number;
  currency: string;
  transactionCount: number;
  iconPath?: string;
}

interface ApiResponse {
  categories: {
    total: number;
    includedCategories: IncludedCategory[];
    excludedCategories: ExcludedCategories[];
  };
}

interface TransactionTagsResponse {
  Tags: Tag[];
}

interface Category {
  categoryId: number;
  categoryName: string;
  iconPath: string;
}

interface PreDefinedResponseCategories {
  totalPages: number;
  totalSize: number;
  categories: Category[];
}

interface BudgetSummary {
  BudgetId: number;
  Amount: number;
  StartDate: number[];
  EndDate: number[];
  RepeatCycleId: string;
  RepeatNumber: number;
  ConsumedAmount: number;
  ConsumedPercentage: number;
  UserId: string;
  AccountId: string;
}

const getMonthDates = (): { fromDate: string; toDate: string } => {
  const currentDate = new Date();
  const yearMonth = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}`;

  const fromDate = `${yearMonth}-01`;
  const toDate = `${yearMonth}-${new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()}`;

  return { fromDate, toDate };
};

// *TODO here i do not use the custom api until the apis is completed
export function useCategories(singleSelectedMonth: SingleSelectedMonthType | undefined) {
  const account = useCurrentAccount();
  const { fromDate, toDate } = getMonthDates();

  const account_id = account.data?.id;

  const categories = useQuery(
    [
      "categories",
      { fromDate: singleSelectedMonth?.fromDate || fromDate, toDate: singleSelectedMonth?.toDate || toDate },
    ],
    () =>
      api<ApiResponse>(
        "v1",
        `accounts/${account_id}/categories`,
        "GET",
        {
          PageSize: 1000,
          PageNumber: 0,
          //TODO: Below hard coded dates should be removed later
          fromDate: singleSelectedMonth?.fromDate || "2021-01-01",
          toDate: singleSelectedMonth?.toDate || "2024-01-01",
        },
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      ),
    {
      // set staleTime to 10 seconds for caching
      staleTime: 10000,
      enabled: !!account_id,
    }
  );
  const isLoading = categories.isLoading;
  const total = categories.data?.categories.total;
  const includedCategories = categories.data?.categories.includedCategories;
  const excludedCategories = categories.data?.categories.excludedCategories;

  return { categories, includedCategories, total, excludedCategories, isLoading };
}

export function usePreDefinedCategories() {
  const account = useCurrentAccount();

  const account_id = account.data?.id;

  const PreDefinedCategories = useQuery(
    ["PreDefinedCategories"],
    () =>
      api<PreDefinedResponseCategories>(
        "v1",
        `accounts/${account_id}/categories/predefined-categories`,
        "GET",
        {
          PageSize: 1000,
          PageNumber: 0,
        },
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      ),
    {
      // set staleTime to 10 seconds for caching
      staleTime: 10000,
      enabled: !!account_id,
    }
  );

  const isLoading = PreDefinedCategories.isLoading;
  const categories = PreDefinedCategories.data?.categories;

  return { categories, isLoading };
}

export function useTransactionTags(singleSelectedMonth: SingleSelectedMonthType | undefined) {
  const account = useCurrentAccount();
  const { fromDate, toDate } = getMonthDates();

  const account_id = account.data?.id;

  const transactionTags = useQuery(
    [
      "transactionTags",
      { fromDate: singleSelectedMonth?.fromDate || fromDate, toDate: singleSelectedMonth?.toDate || toDate },
    ],
    () =>
      api<TransactionTagsResponse>(
        "v1",
        `accounts/${account_id}/tags/transaction-tags`,
        "GET",
        {
          PageSize: 1000,
          PageNumber: 0,
          //TODO: Below hard coded dates should be removed later
          fromDate: singleSelectedMonth?.fromDate || "2000-01-01",
          toDate: singleSelectedMonth?.toDate || "2024-01-01",
        },
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      ),
    {
      // set staleTime to 10 seconds for caching
      staleTime: 10000,
      enabled: !!account_id,
    }
  );

  const tagsLoading = transactionTags.isLoading;
  const tags = transactionTags.data?.Tags;

  return { tags, tagsLoading };
}

export function useCategoryGraph(categoryId: string, intervalState: string, startDate: string | null) {
  const account = useCurrentAccount();
  const account_id = account.data?.id;
  return useQuery(
    ["categoryGrap", { categoryId, intervalState }],
    () =>
      api<GraghApiResponse>(
        "v1",
        `accounts/${account_id}/categories/${categoryId}/graph`,
        "GET",
        {
          intervalState,
          startDate,
        },
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      ),
    {
      // set staleTime to 10 seconds for caching
      staleTime: 10000,
      enabled: !!account_id,
    }
  );
}

export function useLastSixMonthGraph() {
  const account = useCurrentAccount();
  const account_id = account.data?.id;
  return useQuery(
    ["LastSixMonthGraph"],
    () =>
      api<GraghApiResponse>(
        "v1",
        `accounts/${account_id}/transactions/graph`,
        "GET",
        {
          timeFrame: IntervalTypes.LAST_SIX_MONTH,
        },
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      ),
    {
      // set staleTime to 10 seconds for caching
      staleTime: 10000,
      enabled: !!account_id,
    }
  );
}

export function useBudgetSummary(singleSelectedMonth: SingleSelectedMonthType | undefined) {
  const account = useCurrentAccount();
  const { fromDate, toDate } = getMonthDates();

  const account_id = account.data?.id;

  const BudgetSummary = useQuery(
    [
      "BudgetSummary",
      { fromDate: singleSelectedMonth?.fromDate || fromDate, toDate: singleSelectedMonth?.toDate || toDate },
    ],
    () =>
      api<BudgetSummary>(
        "v1",
        `accounts/${account_id}/transactions/budget`,
        "GET",
        {
          PageSize: 1000,
          PageNumber: 0,
          //TODO: Below hard coded dates should be removed later
          startDate: singleSelectedMonth?.fromDate || "2000-01-01",
          endDate: singleSelectedMonth?.toDate || "2024-01-01",
        },
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      ),
    {
      // set staleTime to 10 seconds for caching
      staleTime: 10000,
      enabled: !!account_id,
    }
  );

  const isBudgetLoading = BudgetSummary.isLoading;
  const budgetSummary = BudgetSummary.data;

  return { budgetSummary, isBudgetLoading };
}

export const useGetMonthsSpendingsComparision = (comparisonDates: string) => {
  const { userId } = useAuthContext();
  if (!userId) throw new Error("Need valid `User Id` to be available");
  const account = useCurrentAccount();
  const account_id = account.data?.id;

  const monthSpendingsComparisonSummary = useQuery(
    ["MonthSpendingsComparisonSummary", { comparisonDates }],
    () =>
      api<GetMonthSpendingsComparisonSummary>(
        "v1",
        `accounts/${account_id}/categories/comparison`,
        "GET",
        {
          comparisonDates: comparisonDates,
        },
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
          ["UserId"]: userId,
        }
      ),
    {
      // set staleTime to 10 seconds for caching
      staleTime: 10000,
      enabled: !!account_id,
    }
  );

  const isMonthSpendingsComparisonSummaryLoading = monthSpendingsComparisonSummary.isLoading;
  const monthSpendingsComparison = monthSpendingsComparisonSummary.data;

  return { monthSpendingsComparison, isMonthSpendingsComparisonSummaryLoading };
};
