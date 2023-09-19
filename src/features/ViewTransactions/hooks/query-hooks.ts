import { useMutation, useQuery, useQueryClient } from "react-query";

import sendApiRequest from "@/api";
import { useCurrentAccount } from "@/hooks/use-accounts";
import { generateRandomId } from "@/utils";

import { CreateNewTagApiResponseType, CreateNewTagType, GetCustomerTagsApiResponseType, SingleTagType } from "../types";

interface Category {
  categoryId: number;
  categoryName: string;
  iconPath: string;
  iconViewBox: string;
}

interface ApiCategoriesResponse {
  totalPages: number;
  totalSize: number;
  categories: Category[];
}

interface UpdateCategoryProps {
  transactionIds: string[] | string;
  newCategoryId?: string;
  merchantName: string;
  oldCategoryId?: string;
}

interface PredefinedTagsResponse {
  Tags: Array<SingleTagType>;
}

interface GetTransactionTagsResponse {
  PageCount: number;
  RowCount: number;
  Tags: Array<SingleTagType>;
}

interface UpdateTagResponse {
  Status: string;
  Message: string;
}

export const queryKeys = {
  all: ["tags"] as const,
  customerTags: () => [...queryKeys.all, "customerTags"] as const,
  predefinedTags: () => [...queryKeys.all, "predefinedTags"] as const,
  transactionTags: (transactionId: string) => [...queryKeys.all, "transactionTags", { transactionId }] as const,
};

export function usePredefinedCategories() {
  const account = useCurrentAccount();
  const account_id = account.data?.id;

  const categoriesQuery = useQuery(
    ["categories", account_id],
    () =>
      sendApiRequest<ApiCategoriesResponse>(
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

  return { categories: categoriesQuery.data };
}

export function useUpdateCategory() {
  const account = useCurrentAccount();
  const accountId = account.data?.id;
  const queryClient = useQueryClient();

  const mutation = useMutation(
    ({ transactionIds, newCategoryId, merchantName, oldCategoryId }: UpdateCategoryProps) => {
      const transactionIdsString = Array.isArray(transactionIds) ? transactionIds.join(",") : transactionIds;
      return sendApiRequest<void>(
        "v1",
        `accounts/${accountId}/transactions/${transactionIdsString}?newCategoryId=${newCategoryId}&merchantName=${merchantName}&oldCategoryId=${oldCategoryId}`,
        "PUT",
        {
          PageSize: 1000,
          PageNumber: 0,
        },
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      );
    },
    {
      onSuccess: () => {
        // Refetch queries to update the local data
        queryClient.invalidateQueries("transactions");
        queryClient.invalidateQueries("categories");
      },
    }
  );

  return mutation;
}

export function useExcludeFromSummary() {
  const account = useCurrentAccount();

  const queryClient = useQueryClient();

  const account_id = account.data?.id;

  return useMutation(
    (data: { transactionId: string; hiddenFlag: boolean }) => {
      return sendApiRequest<void>(
        "v1",
        `accounts/${account_id}/transactions/${data.transactionId}`,
        "PUT",
        {
          PageSize: 1000,
          PageNumber: 0,
          hiddenFlag: data.hiddenFlag ? "Y" : "N",
        },
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      );
    },
    {
      onSuccess: () => {
        // Refetch queries to update the local data
        queryClient.invalidateQueries("transactions");
        queryClient.invalidateQueries("categories");
      },
    }
  );
}

export function useCreateNewTag() {
  const account = useCurrentAccount();
  const account_id = account.data?.id;

  return useMutation(async (requestBody: CreateNewTagType) => {
    if (account_id === undefined) throw new Error("Cannot create tags without `account_id`");

    return sendApiRequest<CreateNewTagApiResponseType>(
      "v1",
      `accounts/${account_id}/tags`,
      "POST",
      undefined,
      requestBody,
      {
        ["x-correlation-id"]: generateRandomId(),
      }
    );
  });
}

export function useGetCustomerTags() {
  const account = useCurrentAccount();

  const account_id = account.data?.id;

  return useQuery(
    queryKeys.customerTags(),
    () => {
      if (account_id === undefined) throw new Error("Cannot fetch tags without `account_id`");

      return sendApiRequest<GetCustomerTagsApiResponseType>(
        "v1",
        `accounts/${account_id}/tags/customer-tags`,
        "GET",
        {
          PageSize: 1000,
          PageNumber: 0,
        },
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      );
    },
    {
      enabled: !!account_id,
    }
  );
}

export function usePredefinedTags() {
  const account = useCurrentAccount();
  const account_id = account.data?.id;
  return useQuery(queryKeys.predefinedTags(), () => {
    return sendApiRequest<PredefinedTagsResponse>(
      "v1",
      `accounts/${account_id}/tags/predefined-tags`,
      "GET",
      undefined,
      undefined,
      {
        ["x-correlation-id"]: generateRandomId(),
      }
    );
  });
}

export function useGetTransactionTags(transactionId: string) {
  const account = useCurrentAccount();
  const account_id = account.data?.id;
  return useQuery(queryKeys.transactionTags(transactionId), () => {
    return sendApiRequest<GetTransactionTagsResponse>(
      "v1",
      `accounts/${account_id}/tags/transaction-tags`,
      "GET",
      {
        pageSize: 1000,
        pageNumber: 0,
        transactionId,
      },
      undefined,
      {
        ["x-correlation-id"]: generateRandomId(),
      }
    );
  });
}
export function useDeleteATag() {
  const account = useCurrentAccount();
  const account_id = account.data?.id;

  const queryClient = useQueryClient();
  return useMutation(
    (tagId: number) => {
      if (account_id === undefined) throw new Error("Cannot delete tag without `account_id`");

      return sendApiRequest("v1", `accounts/${account_id}/tags/${tagId}`, "DELETE", undefined, undefined, {
        ["x-correlation-id"]: generateRandomId(),
      });
    },
    {
      onSuccess: () => {
        // Refetch queries to update the local data
        queryClient.invalidateQueries("transactions");
        queryClient.invalidateQueries("transactionTags");
      },
    }
  );
}

export function useUpdateTags() {
  const account = useCurrentAccount();
  const account_id = account.data?.id;
  const queryClient = useQueryClient();

  return useMutation(
    ({ transactionId, tagsId }: { transactionId: string; tagsId: string }) => {
      return sendApiRequest<UpdateTagResponse>(
        "v1",
        `accounts/${account_id}/transactions/${transactionId}`,
        "PUT",
        {
          tagIds: tagsId,
          PageSize: 1000,
          PageNumber: 0,
        },
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      );
    },
    {
      onSuccess: () => {
        // Refetch queries to update the local data
        queryClient.invalidateQueries("transactions");
        queryClient.invalidateQueries("transactionTags");
      },
    }
  );
}
