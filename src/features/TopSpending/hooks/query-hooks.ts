import { useMutation, useQuery } from "react-query";

import api from "@/api";
import { useCurrentAccount } from "@/hooks/use-accounts";
import { generateRandomId } from "@/utils";

import { CreateNewTagApiResponseType, CreateNewTagType, GetCustomerTagsApiResponseType } from "../types";
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

const getMonthDates = (): { fromDate: string; toDate: string } => {
  const currentDate = new Date();
  const yearMonth = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}`;

  const fromDate = `${yearMonth}-01`;
  const toDate = `${yearMonth}-${new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()}`;

  return { fromDate, toDate };
};

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
          fromDate: fromDate,
          toDate: toDate,
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

export function useCreateNewTag() {
  return useMutation(async (requestBody: CreateNewTagType) => {
    //TODO: Later will replace this accountId
    const accountId = "100009269";
    return api<CreateNewTagApiResponseType>("v1", `accounts/${accountId}/tags`, "POST", undefined, requestBody, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}

export function useGetCustomerTags(fromDate: string, toDate: string) {
  return useQuery(["CustomerTags", { fromDate, toDate }], () => {
    //TODO: Later will replace this accountId
    const accountId = "100009269";
    return api<GetCustomerTagsApiResponseType>(
      "v1",
      `accounts/${accountId}/tags/customer-tags`,
      "GET",
      {
        fromDate,
        toDate,
      },
      undefined,
      {
        ["x-correlation-id"]: generateRandomId(),
      }
    );
  });
}

export function useDeleteATag() {
  return useMutation((tagId: number) => {
    //TODO: Later will replace this accountId
    const accountId = "100009269";
    return api("v1", `accounts/${accountId}/tags/${tagId}`, "DELETE", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}
