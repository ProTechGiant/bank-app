import { useMutation, useQuery, useQueryClient } from "react-query";

import sendApiRequest from "@/api";
import { useCurrentAccount } from "@/hooks/use-accounts";
import { generateRandomId } from "@/utils";

import { CreateNewTagApiResponseType, CreateNewTagType, GetCustomerTagsApiResponseType, SingleTagType } from "../types";

interface Category {
  categoryId: number;
  categoryName: string;
  iconPath: string;
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

export default function usePredefinedCategories() {
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
  return useMutation(async (requestBody: CreateNewTagType) => {
    //TODO: Later will replace this accountId
    const accountId = "100009269";
    return sendApiRequest<CreateNewTagApiResponseType>(
      "v1",
      `accounts/${accountId}/tags`,
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
  return useQuery(queryKeys.customerTags(), () => {
    //TODO: Later will replace this accountId
    const accountId = "100009269";
    return sendApiRequest<GetCustomerTagsApiResponseType>(
      "v1",
      `accounts/${accountId}/tags/customer-tags`,
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
  });
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
  const queryClient = useQueryClient();
  return useMutation(
    (tagId: number) => {
      //TODO: Later will replace this accountId
      const accountId = "100009269";
      return sendApiRequest("v1", `accounts/${accountId}/tags/${tagId}`, "DELETE", undefined, undefined, {
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
