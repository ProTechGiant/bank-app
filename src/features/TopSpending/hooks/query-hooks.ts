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

// *TODO here i do not use the custom api until the apis is completed
export function useCategories() {
  const account = useCurrentAccount();
  const { fromDate, toDate } = getMonthDates();

  const account_id = account.data?.id;

  const categories = useQuery<ApiResponse, Error>(
    ["categories", { fromDate, toDate }],
    () =>
      fetch(
        `http://alpha-transaction-service.apps.development.projectcroatia.cloud/v1/accounts/${account_id}/categories?pageSize=1000&pageNumber=0&fromDate=2000-01-01&toDate=2024-01-01`,
        {
          headers: {
            Accept: "application/json",
            "x-correlation-id": generateRandomId(),
            UserId: "301", // replace with appropriate user id
          },
        }
      ).then(res => res.json()),
    {
      // set staleTime to 10 seconds for caching
      staleTime: 10000,
      // enabled only if account_id exists
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
