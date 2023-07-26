import { useQuery } from "react-query";

import api from "@/api";
import { useCurrentAccount } from "@/hooks/use-accounts";
import { generateRandomId } from "@/utils";

import { Tag } from "../types";

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
export function useCategories() {
  const account = useCurrentAccount();
  const { fromDate, toDate } = getMonthDates();

  const account_id = account.data?.id;

  const categories = useQuery(
    ["categories", { fromDate, toDate }],
    () =>
      api<ApiResponse>(
        "v1",
        `accounts/${account_id}/categories`,
        "GET",
        {
          PageSize: 1000,
          PageNumber: 0,
          fromDate: "2000-01-01",
          toDate: "2024-01-01", // these dates for testing now
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

export function useTransactionTags() {
  const account = useCurrentAccount();
  const { fromDate, toDate } = getMonthDates();

  const account_id = account.data?.id;

  const transactionTags = useQuery(
    ["transactionTags", { fromDate, toDate }],
    () =>
      api<TransactionTagsResponse>(
        "v1",
        `accounts/${account_id}/tags/transaction-tags`,
        "GET",
        {
          PageSize: 1000,
          PageNumber: 0,
          fromDate: "2000-01-01",
          toDate: "2024-01-01",
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

export function useBudgetSummary() {
  const account = useCurrentAccount();

  const account_id = account.data?.id;

  const BudgetSummary = useQuery(
    ["BudgetSummary"],
    () =>
      api<BudgetSummary>(
        "v1",
        `accounts/${account_id}/transactions/budget`,
        "GET",
        {
          PageSize: 1000,
          PageNumber: 0,
          startDate: "2000-01-01",
          endDate: "2024-01-01",
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
