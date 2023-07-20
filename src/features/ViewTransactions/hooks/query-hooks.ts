import { useMutation, useQuery, useQueryClient } from "react-query";

import sendApiRequest from "@/api";
import { useCurrentAccount } from "@/hooks/use-accounts";
import { generateRandomId } from "@/utils";

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

  const account_id = account.data?.id;

  return useMutation(async (data: { transactionId: string; hiddenFlag: boolean }) => {
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
  });
}
